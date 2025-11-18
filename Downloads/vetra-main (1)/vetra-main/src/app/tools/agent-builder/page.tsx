"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bot } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { ToolIframeWrapper } from "@/components/tool-iframe-wrapper";

export default function AgentBuilderPage() {
  const router = useRouter();

  useEffect(() => {
    // Enregistrer l'utilisation de open-agent-builder
    apiRequest("/api/tools", {
      method: "POST",
      body: JSON.stringify({
        tool_name: "open-agent-builder",
        tool_type: "ai_agent_builder",
      }),
    }).catch(console.error);

    apiRequest("/api/activity", {
      method: "POST",
      body: JSON.stringify({
        activity_type: "tool-opened",
        tool_name: "open-agent-builder",
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
              <Bot className="w-5 h-5" />
              <div>
                <h1 className="text-lg font-semibold">Open Agent Builder</h1>
                <p className="text-sm text-white/60">Création d'agents IA avec workflows</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-64px)] w-full">
        <ToolIframeWrapper
          baseUrl="https://open-agent-builder-lchp73l76-ibagencys-projects.vercel.app/"
          toolName="open-agent-builder"
          params={{ template: "multi-company-stock-analysis", workspace: "default" }}
          title="Open Agent Builder"
        />
      </div>
    </div>
  );
}

