"use server";

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-server-api";
import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { canMakeAPICall, trackAPICall } from "@/lib/subscription-checker";

/**
 * POST /api/workflows/ai
 * Suggestions AI pour les workflows
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workflow, nodes, edges, action } = body; // action: 'suggest', 'optimize', 'debug', 'explain'

    if (!workflow && !nodes) {
      return NextResponse.json(
        { error: "Workflow or nodes are required" },
        { status: 400 }
      );
    }

    const apiLimit = await canMakeAPICall(user.id);
    if (!apiLimit.allowed) {
      return NextResponse.json(
        { error: apiLimit.message || "API call limit reached" },
        { status: 403 }
      );
    }

    const workflowDescription = workflow || JSON.stringify({ nodes, edges });
    let prompt = "";

    switch (action) {
      case "suggest":
        prompt = `Suggest next nodes to add to this workflow:\n\n${workflowDescription}`;
        break;
      case "optimize":
        prompt = `Optimize this workflow for better performance and logic:\n\n${workflowDescription}`;
        break;
      case "debug":
        prompt = `Debug this workflow and suggest fixes:\n\n${workflowDescription}`;
        break;
      case "explain":
        prompt = `Explain how this workflow works:\n\n${workflowDescription}`;
        break;
      default:
        prompt = `Help me improve this workflow:\n\n${workflowDescription}`;
    }

    const aiResponse = await aiOrchestrator.generateText({
      task: "text",
      prompt,
      model: "deepseek",
      options: {
        temperature: 0.5,
        maxTokens: 2000,
      },
    });

    await trackAPICall(user.id, "/api/workflows/ai");

    return NextResponse.json({
      suggestion: aiResponse.content,
      model: aiResponse.model,
      tokens: aiResponse.tokens,
    });
  } catch (error: any) {
    console.error("Workflows AI error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

