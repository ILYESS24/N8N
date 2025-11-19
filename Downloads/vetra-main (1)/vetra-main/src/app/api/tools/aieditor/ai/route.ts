"use server";

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase-server-api";
import { aiOrchestrator } from "@/lib/ai/orchestrator";
import { canMakeAPICall, trackAPICall } from "@/lib/subscription-checker";

/**
 * POST /api/tools/aieditor/ai
 * Amélioration de texte AI pour AiEditor
 */
export async function POST(request: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { text, action, style, tone } = body; // action: 'improve', 'rewrite', 'summarize', 'expand'

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
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
      case "improve":
        prompt = `Improve this text while keeping its meaning:\n\n${text}${style ? `\n\nStyle: ${style}` : ""}${tone ? `\n\nTone: ${tone}` : ""}`;
        break;
      case "rewrite":
        prompt = `Rewrite this text${style ? ` in ${style} style` : ""}${tone ? ` with ${tone} tone` : ""}:\n\n${text}`;
        break;
      case "summarize":
        prompt = `Summarize this text:\n\n${text}`;
        break;
      case "expand":
        prompt = `Expand this text with more details:\n\n${text}`;
        break;
      default:
        prompt = `Help me improve this text:\n\n${text}`;
    }

    const aiResponse = await aiOrchestrator.generateText({
      task: "text",
      prompt,
      model: "deepseek",
      options: {
        temperature: 0.7,
        maxTokens: 2000,
      },
    });

    await trackAPICall(user.id, "/api/tools/aieditor/ai");

    return NextResponse.json({
      improvedText: aiResponse.content,
      model: aiResponse.model,
      tokens: aiResponse.tokens,
    });
  } catch (error: any) {
    console.error("AiEditor AI error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

