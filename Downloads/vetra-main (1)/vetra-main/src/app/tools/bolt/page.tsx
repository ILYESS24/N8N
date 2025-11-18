"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { ToolIframeWrapper } from "@/components/tool-iframe-wrapper";

export default function BoltPage() {
  const router = useRouter();

  useEffect(() => {
    // Enregistrer l'utilisation de bolt.new
    apiRequest("/api/tools", {
      method: "POST",
      body: JSON.stringify({
        tool_name: "bolt.new",
        tool_type: "website_builder",
      }),
    }).catch(console.error);

    apiRequest("/api/activity", {
      method: "POST",
      body: JSON.stringify({
        activity_type: "tool-opened",
        tool_name: "bolt.new",
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
            <div>
              <h1 className="text-lg font-semibold">Bolt.new - Builder de Sites</h1>
              <p className="text-sm text-white/60">Création de sites web avec IA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-64px)] w-full">
        <ToolIframeWrapper
          baseUrl="https://a0984a33.ai-assistant-xlv.pages.dev/"
          toolName="bolt.new"
          params={{ workspace: "default" }}
          title="Bolt.new Builder"
        />
      </div>
    </div>
  );
}

