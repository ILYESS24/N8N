import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';

// GET - Récupère l'activité récente en temps réel
export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const since = searchParams.get('since'); // ISO timestamp

    let query = (supabase as any)
      .from('realtime_activity')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (since) {
      query = query.gt('created_at', since);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ activities: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Enregistre une nouvelle activité
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tool_name, project_id, activity_type, activity_data } = body;

    if (!activity_type) {
      return NextResponse.json(
        { error: 'Activity type is required' },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from('realtime_activity')
      .insert({
        user_id: user.id,
        tool_name: tool_name || null,
        project_id: project_id || null,
        activity_type,
        activity_data: activity_data || {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ activity: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

