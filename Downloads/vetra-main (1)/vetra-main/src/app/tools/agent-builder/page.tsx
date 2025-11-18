"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Bot, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/api-client";

export default function AgentBuilderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Enregistrer l'utilisation de open-agent-builder
    apiRequest("/api/tools", {
      method: "POST",
      body: JSON.stringify({
        tool_name: "open-agent-builder",
        tool_type: "ai_agent_builder",
      }),
    });

    apiRequest("/api/activity", {
      method: "POST",
      body: JSON.stringify({
        activity_type: "tool-opened",
        tool_name: "open-agent-builder",
      }),
    });

    setLoading(false);
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

      <div className="max-w-7xl mx-auto p-6">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Agent Builder</h2>
                <p className="text-white/60">
                  Créez des agents IA intelligents avec des workflows visuels. 
                  Automatisez vos tâches avec LangGraph et MCP.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-white/80 mb-4">
                  <strong>Note:</strong> Open Agent Builder est une application Next.js complète. 
                  Pour une intégration native, vous pouvez :
                </p>
                <ul className="text-left text-white/60 space-y-2 mb-6">
                  <li>• Extraire les composants de workflow builder</li>
                  <li>• Intégrer l'éditeur de nodes (React Flow)</li>
                  <li>• Connecter avec l'API LangGraph</li>
                  <li>• Synchroniser avec le système d'agents AURION</li>
                </ul>
                
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/workflows")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ouvrir Workflow Builder
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Retour au Dashboard
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="font-semibold mb-2">Workflows Visuels</h3>
                  <p className="text-sm text-white/70">
                    Créez des workflows complexes avec un éditeur de nodes intuitif
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="font-semibold mb-2">LangGraph</h3>
                  <p className="text-sm text-white/70">
                    Exécutez des agents avec LangGraph pour des workflows avancés
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                  <h3 className="font-semibold mb-2">MCP Integration</h3>
                  <p className="text-sm text-white/70">
                    Connectez vos agents à des outils externes via MCP
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

