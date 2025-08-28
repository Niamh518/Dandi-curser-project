import { NextRequest, NextResponse } from 'next/server';
import { summarizeGitHubRepo } from '../../lib/langchain';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { githubUrl, apiKey } = await request.json();

    // Validate API key first
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // Check if API key exists and is active
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, name, is_active')
      .eq('key', apiKey)
      .single();

    if (keyError || !keyData) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (!keyData.is_active) {
      return NextResponse.json(
        { error: 'API key is inactive' },
        { status: 401 }
      );
    }

    // Update last_used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', keyData.id);

    if (!githubUrl) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    if (!githubUrl.includes('github.com')) {
      return NextResponse.json(
        { error: 'Please provide a valid GitHub URL' },
        { status: 400 }
      );
    }

    // Generate summary using LangChain
    const summary = await summarizeGitHubRepo(githubUrl);

    // Try to parse the response as JSON
    let parsedSummary;
    try {
      parsedSummary = JSON.parse(summary as string);
    } catch {
      // If parsing fails, return the raw response
      parsedSummary = {
        summary: summary,
        cool_facts: ['Analysis completed successfully']
      };
    }

    return NextResponse.json(parsedSummary);

  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json(
      { error: 'Failed to summarize GitHub repository' },
      { status: 500 }
    );
  }
}
