"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Brain, Globe, Zap, FileCode, Bot, ArrowRight, Clock, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { useRealtime } from "@/hooks/use-realtime";

interface Tool {
  id: string;
  tool_name: string;
  tool_type: string;
  status: string;
  last_used_at: string;
  usage_count: number;
}

interface Activity {
  id: string;
  tool_name: string;
  activity_type: string;
  created_at: string;
}

const toolIcons: Record<string, any> = {
  sandpack: FileCode,
  langchain: Brain,
  aieditor: Code,
  'bolt.new': Globe,
  'open-agent-builder': Bot,
  'open-webui': MessageSquare,
  vetra: Zap,
};

const toolNames: Record<string, string> = {
  sandpack: 'Sandpack',
  langchain: 'Langchain',
  aieditor: 'AI Editor',
  'bolt.new': 'Bolt.new',
  'open-agent-builder': 'Open Agent Builder',
  'open-webui': 'Open WebUI',
  vetra: 'Vetra',
};

export function IntegratedToolsPanel() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { events } = useRealtime();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Réagir aux événements temps réel
  useEffect(() => {
    if (events.length > 0) {
      const lastEvent = events[events.length - 1];
      if (lastEvent.type === 'activity' || lastEvent.type === 'recommendation') {
        loadData(); // Recharger les données
      }
    }
  }, [events]);

  const loadData = async () => {
    try {
      const [toolsData, activityData] = await Promise.all([
        apiRequest("/api/tools"),
        apiRequest("/api/activity?limit=10"),
      ]);
      setTools(toolsData.tools || []);
      setRecentActivity(activityData.activities || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToolClick = async (tool: Tool) => {
    // Enregistrer l'utilisation
    await apiRequest("/api/tools", {
      method: "POST",
      body: JSON.stringify({
        tool_name: tool.tool_name,
        tool_type: tool.tool_type,
      }),
    });

    // Rediriger vers l'outil (à adapter selon vos routes)
    const toolRoutes: Record<string, string> = {
      sandpack: '/tools/sandpack',
      langchain: '/tools/langchain',
      aieditor: '/tools/aieditor',
      'bolt.new': '/tools/bolt',
      'open-agent-builder': '/workflows',
      'open-webui': '/tools/open-webui',
    };

    const route = toolRoutes[tool.tool_name];
    if (route) {
      router.push(route);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days}j`;
    if (hours > 0) return `Il y a ${hours}h`;
    if (minutes > 0) return `Il y a ${minutes}min`;
    return "À l'instant";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Outils intégrés */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Outils intégrés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-white/60 text-sm">Chargement...</div>
          ) : tools.length === 0 ? (
            <div className="text-white/60 text-sm">
              Aucun outil utilisé. Commencez par créer votre premier projet !
            </div>
          ) : (
            tools.map((tool) => {
              const Icon = toolIcons[tool.tool_name] || Code;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleToolClick(tool)}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{toolNames[tool.tool_name] || tool.tool_name}</p>
                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Clock className="w-3 h-3" />
                          <span>{tool.last_used_at ? formatTimeAgo(tool.last_used_at) : "Jamais utilisé"}</span>
                          <span>·</span>
                          <span>{tool.usage_count} utilisation{tool.usage_count > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Activité récente */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Activité en temps réel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="text-white/60 text-sm">Chargement...</div>
          ) : recentActivity.length === 0 ? (
            <div className="text-white/60 text-sm">Aucune activité récente</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentActivity.map((activity) => {
                const Icon = toolIcons[activity.tool_name || ''] || Zap;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div className="p-1.5 bg-white/10 rounded-lg mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-white/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">
                        {activity.tool_name && (
                          <span className="font-medium">{toolNames[activity.tool_name] || activity.tool_name}</span>
                        )}{' '}
                        {activity.activity_type === 'tool-switch' && 'a été ouvert'}
                        {activity.activity_type === 'project-created' && 'Nouveau projet créé'}
                        {activity.activity_type === 'workflow-started' && 'Workflow démarré'}
                        {activity.activity_type === 'recommendation-accepted' && 'Recommandation acceptée'}
                        {activity.activity_type === 'code-saved' && 'Code sauvegardé'}
                        {activity.activity_type === 'agent-deployed' && 'Agent déployé'}
                      </p>
                      <p className="text-xs text-white/60 mt-1">
                        {formatTimeAgo(activity.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

