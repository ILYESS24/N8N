import { NextRequest } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';

// SSE endpoint pour les mises à jour en temps réel
export async function GET(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Créer un stream SSE
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Envoyer un message de connexion
        const send = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        send({ type: 'connected', message: 'Connexion établie' });

        // Polling pour les nouvelles activités (peut être remplacé par Supabase Realtime)
        const pollInterval = setInterval(async () => {
          try {
            const { data: activities } = await (supabase as any)
              .from('realtime_activity')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(1);

            if (activities && activities.length > 0) {
              send({
                type: 'activity',
                data: activities[0],
              });
            }

            // Vérifier les nouvelles recommandations
            const { data: recommendations } = await (supabase as any)
              .from('ai_recommendations')
              .select('*')
              .eq('user_id', user.id)
              .eq('status', 'pending')
              .order('created_at', { ascending: false })
              .limit(1);

            if (recommendations && recommendations.length > 0) {
              send({
                type: 'recommendation',
                data: recommendations[0],
              });
            }
          } catch (error) {
            console.error('Error polling:', error);
          }
        }, 3000); // Poll toutes les 3 secondes

        // Nettoyer à la fermeture
        request.signal.addEventListener('abort', () => {
          clearInterval(pollInterval);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

