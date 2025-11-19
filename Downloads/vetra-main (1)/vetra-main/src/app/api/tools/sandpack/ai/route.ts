"use server";

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-server-api";
import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { canMakeAPICall, trackAPICall } from "@/lib/subscription-checker";

/**
 * POST /api/tools/sandpack/ai
 * Suggestions de code AI pour Sandpack
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { code, context, action } = body; // action: 'suggest', 'explain', 'refactor', 'debug'

    if (!code && !context) {
      return NextResponse.json(
        { error: "Code or context is required" },
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

    let prompt = "";
    switch (action) {
      case "suggest":
        prompt = `Suggest code improvements for this code:\n\n${code}\n\nContext: ${context || "No context"}`;
        break;
      case "explain":
        prompt = `Explain this code in detail:\n\n${code}`;
        break;
      case "refactor":
        prompt = `Refactor this code to be more efficient and clean:\n\n${code}`;
        break;
      case "debug":
        prompt = `Debug this code and suggest fixes:\n\n${code}\n\nError context: ${context || "No error context"}`;
        break;
      default:
        prompt = `Help me with this code:\n\n${code}\n\nContext: ${context || "No context"}`;
    }

    const aiResponse = await aiOrchestrator.generateText({
      task: "code",
      prompt,
      model: "deepseek",
      options: {
        temperature: 0.3,
        maxTokens: 2000,
      },
    });

    await trackAPICall(user.id, "/api/tools/sandpack/ai");

    return NextResponse.json({
      suggestion: aiResponse.content,
      model: aiResponse.model,
      tokens: aiResponse.tokens,
    });
  } catch (error: any) {
    console.error("Sandpack AI error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

