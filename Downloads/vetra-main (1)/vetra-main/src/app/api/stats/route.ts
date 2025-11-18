import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';

export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get projects count
    const { count: projectsCount } = await (supabase as any)
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get content items count
    const { count: contentCount } = await (supabase as any)
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get agents count
    const { count: agentsCount } = await (supabase as any)
      .from('ai_agents')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get active projects
    const { count: activeProjectsCount } = await (supabase as any)
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'published');

    // Get recent projects
    const { data: recentProjects } = await (supabase as any)
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        projects: projectsCount || 0,
        content: contentCount || 0,
        agents: agentsCount || 0,
        activeProjects: activeProjectsCount || 0,
      },
      recentProjects: recentProjects || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

