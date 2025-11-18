"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { ToolIframeWrapper } from "@/components/tool-iframe-wrapper";

export default function LangchainPage() {
  const router = useRouter();

  useEffect(() => {
    // Enregistrer l'utilisation de langchain
    apiRequest("/api/tools", {
      method: "POST",
      body: JSON.stringify({
        tool_name: "langchain",
        tool_type: "llm_framework",
      }),
    }).catch(console.error);

    apiRequest("/api/activity", {
      method: "POST",
      body: JSON.stringify({
        activity_type: "tool-opened",
        tool_name: "langchain",
      }),
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070F] text-white">
      <div className="border-b border-white/10 bg-[#05070F]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5" />
              <div>
                <h1 className="text-lg font-semibold">Langchain</h1>
                <p className="text-sm text-white/60">Framework LLM pour applications IA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-64px)] w-full">
        <ToolIframeWrapper
          baseUrl="https://34c96d83.langchain-ai.pages.dev/"
          toolName="langchain"
          params={{ workspace: "default" }}
          title="Langchain AI"
        />
      </div>
    </div>
  );
}

