import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';
import { aiOrchestrator } from '@/lib/ai/orchestrator';
import { autonomousGenerator } from '@/lib/ai/autonomous-generator';

/**
 * POST /api/ai/generate
 * Génération IA unifiée (texte, code, image, vidéo)
 */
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { task, prompt, model, options, type } = body;

    if (!task || !prompt) {
      return NextResponse.json(
        { error: 'Task and prompt are required' },
        { status: 400 }
      );
    }

    // Génération autonome de projet complet
    if (type === 'autonomous' && task === 'project') {
      const projectDescription = {
        name: body.name || 'Generated Project',
        description: prompt,
        type: body.projectType || 'saas',
        features: body.features || [],
        techStack: body.techStack || {},
      };

      const project = await autonomousGenerator.generateProject(projectDescription);

      // Enregistrer l'activité
      await (supabase as any)
        .from('realtime_activity')
        .insert({
          user_id: user.id,
          tool_name: 'ai_orchestrator',
          activity_type: 'project_generated',
          activity_data: {
            projectName: projectDescription.name,
            type: projectDescription.type,
          },
        });

      return NextResponse.json({
        success: true,
        project,
        type: 'autonomous',
      });
    }

    // Génération standard (texte, code, image, vidéo)
    const response = await aiOrchestrator.process({
      task,
      prompt,
      model,
      options,
    });

    // Enregistrer l'activité
    await (supabase as any)
      .from('realtime_activity')
      .insert({
        user_id: user.id,
        tool_name: 'ai_orchestrator',
        activity_type: `ai_${task}_generated`,
        activity_data: {
          task,
          model: response.model,
          tokens: response.tokens,
          cost: response.cost,
        },
      });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: error.message || 'AI generation failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/generate
 * Liste les modèles disponibles
 */
export async function GET() {
  return NextResponse.json({
    models: [
      {
        id: 'deepseek',
        name: 'DeepSeek',
        tasks: ['text', 'code', 'chat'],
        cost: '$0.14 per 1M tokens',
      },
      {
        id: 'openai',
        name: 'OpenAI GPT-4',
        tasks: ['text', 'code', 'chat'],
        cost: '$30 per 1M tokens',
      },
      {
        id: 'ollama',
        name: 'Ollama (Local)',
        tasks: ['text', 'code', 'chat'],
        cost: 'Free (local)',
      },
      {
        id: 'replicate',
        name: 'Replicate',
        tasks: ['image', 'video'],
        cost: 'Variable',
      },
    ],
    tasks: ['text', 'code', 'image', 'video', 'chat', 'project'],
  });
}

