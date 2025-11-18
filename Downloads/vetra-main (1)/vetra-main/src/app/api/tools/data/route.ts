import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';
import { createServerSupabaseClient } from '@/lib/supabase-server';

/**
 * API pour synchroniser les données entre AURION et les outils intégrés
 * Permet aux outils de sauvegarder/charger des données spécifiques à l'utilisateur
 */
export async function GET(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const toolName = searchParams.get('tool');
    const dataType = searchParams.get('type') || 'workspace';

    const supabase = await createServerSupabaseClient();

    // Récupérer les données de l'utilisateur pour cet outil
    const { data, error } = await (supabase as any)
      .from('content_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('metadata->>tool', toolName)
      .eq('type', dataType)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Tool data API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tool, type, data: contentData, title } = body;

    if (!tool || !contentData) {
      return NextResponse.json(
        { error: 'Tool and data are required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Sauvegarder les données de l'utilisateur
    const { data, error } = await (supabase as any)
      .from('content_items')
      .insert({
        user_id: user.id,
        type: type || 'workspace',
        title: title || `${tool} Workspace`,
        content: typeof contentData === 'string' ? contentData : JSON.stringify(contentData),
        metadata: { tool, saved_at: new Date().toISOString() },
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Tool data API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, data: contentData } = body;

    if (!id || !contentData) {
      return NextResponse.json(
        { error: 'ID and data are required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Mettre à jour les données de l'utilisateur
    const { data, error } = await (supabase as any)
      .from('content_items')
      .update({
        content: typeof contentData === 'string' ? contentData : JSON.stringify(contentData),
        metadata: { updated_at: new Date().toISOString() },
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Tool data API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

