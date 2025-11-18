import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';

// GET - Liste tous les outils de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await (supabase as any)
      .from('integrated_tools')
      .select('*')
      .eq('user_id', user.id)
      .order('last_used_at', { ascending: false, nullsFirst: false });

    if (error) throw error;

    return NextResponse.json({ tools: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Enregistre l'utilisation d'un outil
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tool_name, tool_type, project_id, config } = body;

    if (!tool_name || !tool_type) {
      return NextResponse.json(
        { error: 'Tool name and type are required' },
        { status: 400 }
      );
    }

    // Vérifier si l'outil existe déjà
    const { data: existing } = await (supabase as any)
      .from('integrated_tools')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_name', tool_name)
      .single();

    let result;
    if (existing) {
      // Mettre à jour
      result = await (supabase as any)
        .from('integrated_tools')
        .update({
          last_used_at: new Date().toISOString(),
          usage_count: (existing.usage_count || 0) + 1,
          project_id: project_id || null,
          config: config || {},
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Créer
      result = await (supabase as any)
        .from('integrated_tools')
        .insert({
          user_id: user.id,
          tool_name,
          tool_type,
          project_id: project_id || null,
          config: config || {},
          last_used_at: new Date().toISOString(),
          usage_count: 1,
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    // Enregistrer l'activité
    await (supabase as any)
      .from('realtime_activity')
      .insert({
        user_id: user.id,
        tool_name,
        project_id: project_id || null,
        activity_type: 'tool-switch',
        activity_data: { tool_type, config },
      });

    return NextResponse.json({ tool: result.data }, { status: existing ? 200 : 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

