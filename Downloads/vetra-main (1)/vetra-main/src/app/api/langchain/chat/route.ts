import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';

// POST - Interface pour Langchain (à connecter avec un backend Python)
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // TODO: Connecter avec un backend Python qui utilise Langchain
    // Pour l'instant, réponse mockée
    // Exemple d'intégration future:
    // const response = await fetch('http://localhost:8000/api/langchain/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ prompt, user_id: user.id }),
    // });
    // const data = await response.json();

    // Enregistrer l'activité
    await (supabase as any)
      .from('realtime_activity')
      .insert({
        user_id: user.id,
        tool_name: 'langchain',
        activity_type: 'langchain-query',
        activity_data: { prompt_length: prompt.length },
      });

    return NextResponse.json({
      response: `Réponse mockée pour: "${prompt}". Pour une intégration complète, configurez un backend Python avec Langchain qui expose une API REST.`,
      note: 'Langchain API non configurée. Veuillez configurer le backend Python.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

