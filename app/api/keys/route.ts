import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Using Supabase instead of in-memory mock

// GET - Retrieve all API keys
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map DB fields to API shape
    const payload = (data || []).map((row: any) => ({
      id: String(row.id),
      name: row.name,
      key: row.key,
      createdAt: row.created_at,
      lastUsed: row.last_used ?? undefined,
      isActive: row.is_active,
      type: row.type ?? 'dev',
      monthlyLimit: row.monthly_limit ?? null,
    }));

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, monthlyLimit } = body as {
      name?: string;
      type?: 'dev' | 'prod';
      monthlyLimit?: number | null;
    };

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const insert = {
      name,
      key: `pk_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`,
      is_active: true,
      type: type ?? 'dev',
      monthly_limit: monthlyLimit ?? null,
    };

    const { data, error } = await supabase
      .from('api_keys')
      .insert(insert)
      .select('*')
      .single();

    if (error) throw error;

    const payload = {
      id: String(data.id),
      name: data.name,
      key: data.key,
      createdAt: data.created_at,
      isActive: data.is_active,
      type: data.type ?? 'dev',
      monthlyLimit: data.monthly_limit ?? null,
    };

    return NextResponse.json({ success: true, data: payload }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// PUT - Update an API key
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, isActive } = body as { id?: string; name?: string; isActive?: boolean };

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (isActive !== undefined) updates.is_active = isActive;

    const { data, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    const payload = {
      id: String(data.id),
      name: data.name,
      key: data.key,
      createdAt: data.created_at,
      lastUsed: data.last_used ?? undefined,
      isActive: data.is_active,
      type: data.type ?? 'dev',
      monthlyLimit: data.monthly_limit ?? null,
    };

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an API key
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;

    const payload = {
      id: String(data.id),
      name: data.name,
      key: data.key,
      createdAt: data.created_at,
      lastUsed: data.last_used ?? undefined,
      isActive: data.is_active,
      type: data.type ?? 'dev',
      monthlyLimit: data.monthly_limit ?? null,
    };

    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
