import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    // Query the database to check if the API key exists and is active
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, is_active')
      .eq('key', apiKey)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }

    if (!data.is_active) {
      return NextResponse.json(
        { success: false, error: 'API key is inactive' },
        { status: 401 }
      );
    }

    // Update last_used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', data.id);

    return NextResponse.json({
      success: true,
      message: 'API key is valid',
      data: {
        id: data.id,
        name: data.name
      }
    });

  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
