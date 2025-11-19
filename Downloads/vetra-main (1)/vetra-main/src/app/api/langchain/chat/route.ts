import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';
import { aiOrchestrator } from '@/lib/ai/orchestrator';
import { canMakeAPICall, trackAPICall } from '@/lib/subscription-checker';

// POST - Interface Langchain connectée à DeepSeek
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, messages, model } = body;

    if (!prompt && !messages) {
      return NextResponse.json(
        { error: 'Prompt or messages are required' },
        { status: 400 }
      );
    }

    // Vérifier les limites d'appels API
    const apiLimit = await canMakeAPICall(user.id);
    if (!apiLimit.allowed) {
      return NextResponse.json(
        { error: apiLimit.message || 'API call limit reached' },
        { status: 403 }
      );
    }

    // Utiliser l'orchestrateur AI avec DeepSeek
    const aiResponse = await aiOrchestrator.generateText({
      task: 'chat',
      prompt: prompt || (messages && messages[messages.length - 1]?.content) || '',
      model: model || 'deepseek',
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
        tool_name: 'langchain',
        activity_type: 'langchain-query',
        activity_data: { 
          prompt_length: prompt?.length || 0,
          model: aiResponse.model,
        },
      });

    // Tracker l'appel API
    await trackAPICall(user.id, '/api/langchain/chat');

    return NextResponse.json({
      response: aiResponse.content,
      model: aiResponse.model,
      tokens: aiResponse.tokens,
      metadata: aiResponse.metadata,
    });
  } catch (error: any) {
    console.error('Langchain API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}

