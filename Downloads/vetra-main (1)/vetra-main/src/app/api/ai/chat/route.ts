import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';
import { aiOrchestrator } from '@/lib/ai/orchestrator';

/**
 * POST /api/ai/chat
 * Chat avec l'IA (streaming support)
 */
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { messages, model, stream } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Construire le prompt à partir des messages
    const prompt = messages
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Support streaming
    if (stream) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            // Pour le streaming, on utilise l'API directement
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || 'sk-491b1fc66cc14b3aaf40ea6511008bfa'}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages.map((msg: any) => ({
                  role: msg.role,
                  content: msg.content,
                })),
                stream: true,
              }),
            });

            if (!response.ok) {
              throw new Error('Streaming failed');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
              throw new Error('No reader available');
            }

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') {
                    controller.close();
                    return;
                  }

                  try {
                    const json = JSON.parse(data);
                    const content = json.choices?.[0]?.delta?.content;
                    if (content) {
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                    }
                  } catch (e) {
                    // Ignore parse errors
                  }
                }
              }
            }

            controller.close();
          } catch (error: any) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Mode non-streaming
    const response = await aiOrchestrator.generateText({
      task: 'chat',
      prompt,
      model,
      options: {
        temperature: 0.7,
        maxTokens: 2000,
      },
    });

    // Enregistrer l'activité
    await (supabase as any)
      .from('realtime_activity')
      .insert({
        user_id: user.id,
        tool_name: 'ai_orchestrator',
        activity_type: 'ai_chat',
        activity_data: {
          messagesCount: messages.length,
          model: response.model,
          tokens: response.tokens,
        },
      });

    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: response.content,
      },
      metadata: {
        model: response.model,
        tokens: response.tokens,
        cost: response.cost,
      },
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: error.message || 'AI chat failed' },
      { status: 500 }
    );
  }
}

