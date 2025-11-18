import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/supabase-server-api';

// POST - Interagit avec l'assistant IA et génère des recommandations
export async function POST(request: NextRequest) {
  try {
    const { user, supabase } = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Récupérer le contexte de l'utilisateur
    const [toolsResult, projectsResult, recentActivityResult] = await Promise.all([
      (supabase as any).from('integrated_tools').select('*').eq('user_id', user.id),
      (supabase as any).from('projects').select('*').eq('user_id', user.id).limit(5),
      (supabase as any).from('realtime_activity').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
    ]);

    const userContext = {
      tools: toolsResult.data || [],
      projects: projectsResult.data || [],
      recentActivity: recentActivityResult.data || [],
      currentContext: context || {},
    };

    // Générer une réponse et des recommandations basées sur le contexte
    // Pour l'instant, logique simple - peut être améliorée avec une vraie IA
    const recommendations = generateRecommendations(userContext, message);

    // Enregistrer la conversation
    await (supabase as any)
      .from('ai_assistant_conversations')
      .insert({
        user_id: user.id,
        message,
        context: userContext,
        tool_suggested: recommendations[0]?.action?.tool || null,
      });

    // Créer les recommandations
    if (recommendations.length > 0) {
      for (const rec of recommendations) {
        await (supabase as any)
          .from('ai_recommendations')
          .insert({
            user_id: user.id,
            type: rec.type,
            title: rec.title,
            description: rec.description,
            action: rec.action,
            priority: rec.priority,
            context: userContext,
          });
      }
    }

    return NextResponse.json({
      response: generateResponse(message, userContext),
      recommendations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Fonction pour générer des recommandations intelligentes
function generateRecommendations(context: any, message: string): any[] {
  const recommendations: any[] = [];
  const messageLower = message.toLowerCase();

  // Si l'utilisateur n'a pas encore utilisé d'outils
  if (context.tools.length === 0) {
    recommendations.push({
      type: 'tool-suggestion',
      title: 'Commencer avec Sandpack',
      description: 'Créez votre premier projet de code avec notre éditeur en ligne. Parfait pour débuter !',
      action: { tool: 'sandpack', action: 'create', params: {} },
      priority: 9,
    });
  }

  // Si l'utilisateur mentionne créer un site
  if (messageLower.includes('site') || messageLower.includes('website') || messageLower.includes('web')) {
    recommendations.push({
      type: 'next-step',
      title: 'Créer un site web',
      description: 'Utilisez bolt.new pour créer rapidement un site web moderne avec IA',
      action: { tool: 'bolt.new', action: 'create-website', params: {} },
      priority: 8,
    });
  }

  // Si l'utilisateur mentionne un agent IA
  if (messageLower.includes('agent') || messageLower.includes('automatisation')) {
    recommendations.push({
      type: 'tool-suggestion',
      title: 'Créer un agent IA',
      description: 'Utilisez Open Agent Builder pour créer des agents intelligents',
      action: { tool: 'open-agent-builder', action: 'create-agent', params: {} },
      priority: 8,
    });
  }

  // Si l'utilisateur a des projets mais pas de workflow
  if (context.projects.length > 0 && context.tools.length > 1) {
    recommendations.push({
      type: 'workflow',
      title: 'Créer un workflow',
      description: 'Connectez vos outils pour automatiser votre workflow',
      action: { tool: 'workflow', action: 'create', params: {} },
      priority: 7,
    });
  }

  return recommendations;
}

// Fonction pour générer une réponse
function generateResponse(message: string, context: any): string {
  const messageLower = message.toLowerCase();

  if (messageLower.includes('bonjour') || messageLower.includes('salut') || messageLower.includes('hello')) {
    return `Bonjour ! Je suis votre assistant AURION. Je peux vous aider à naviguer entre vos outils et vous guider dans vos projets. Que souhaitez-vous créer aujourd'hui ?`;
  }

  if (messageLower.includes('commencer') || messageLower.includes('débuter') || messageLower.includes('start')) {
    if (context.tools.length === 0) {
      return `Parfait ! Pour commencer, je vous recommande de créer votre premier projet avec Sandpack, notre éditeur de code en ligne. C'est l'outil idéal pour débuter !`;
    } else {
      return `Vous avez déjà ${context.tools.length} outil(s) configuré(s). Voulez-vous créer un nouveau projet ou continuer sur un projet existant ?`;
    }
  }

  if (messageLower.includes('aide') || messageLower.includes('help')) {
    return `Je peux vous aider à :
- Naviguer entre vos outils (Sandpack, Langchain, AiEditor, bolt.new, Open Agent Builder)
- Créer des workflows entre vos projets
- Vous suggérer les meilleures pratiques
- Répondre à vos questions sur AURION

Que souhaitez-vous faire ?`;
  }

  return `Je comprends. Laissez-moi analyser votre contexte et vous proposer les meilleures actions. Consultez les recommandations ci-dessous !`;
}

