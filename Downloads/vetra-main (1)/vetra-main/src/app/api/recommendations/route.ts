import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';

// GET - Récupère les recommandations de l'assistant IA
export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '10');

    const { data, error } = await (supabase as any)
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', status)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({ recommendations: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Génère une nouvelle recommandation (appelé par l'IA)
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, description, action, priority, context } = body;

    if (!type || !title || !description) {
      return NextResponse.json(
        { error: 'Type, title and description are required' },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from('ai_recommendations')
      .insert({
        user_id: user.id,
        type,
        title,
        description,
        action: action || null,
        priority: priority || 5,
        context: context || {},
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ recommendation: data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH - Met à jour le statut d'une recommandation
export async function PATCH(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }

    const { data, error } = await (supabase as any)
      .from('ai_recommendations')
      .update({ status })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    // Si acceptée, enregistrer l'activité
    if (status === 'accepted' && data.action) {
      await (supabase as any)
        .from('realtime_activity')
        .insert({
          user_id: user.id,
          activity_type: 'recommendation-accepted',
          activity_data: { recommendation_id: id, action: data.action },
        });
    }

    return NextResponse.json({ recommendation: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

