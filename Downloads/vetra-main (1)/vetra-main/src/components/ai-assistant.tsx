"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, X, Send, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api-client";

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  action?: any;
  priority: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRecommendations();
    // Message de bienvenue
    setMessages([{
      role: "assistant",
      content: "Bonjour ! Je suis votre assistant AURION. Je peux vous guider dans l'utilisation de vos outils et vous suggérer les meilleures actions. Comment puis-je vous aider ?",
      timestamp: new Date(),
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadRecommendations = async () => {
    try {
      const data = await apiRequest("/api/recommendations?status=pending&limit=5");
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiRequest("/api/assistant", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          context: {},
        }),
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.recommendations && response.recommendations.length > 0) {
        setRecommendations((prev) => [...prev, ...response.recommendations]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRecommendation = async (recommendation: Recommendation) => {
    try {
      await apiRequest("/api/recommendations", {
        method: "PATCH",
        body: JSON.stringify({
          id: recommendation.id,
          status: "accepted",
        }),
      });

      setRecommendations((prev) => prev.filter((r) => r.id !== recommendation.id));

      // Exécuter l'action si disponible
      if (recommendation.action) {
        // TODO: Implémenter l'exécution de l'action
        console.log("Executing action:", recommendation.action);
      }
    } catch (error) {
      console.error("Error accepting recommendation:", error);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-br from-[#8EE3FF] to-[#0066FF] hover:from-[#0066FF] hover:to-[#8EE3FF] shadow-lg"
        >
          <Sparkles className="w-6 h-6 text-white" />
        </Button>
        {recommendations.length > 0 && (
          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
            {recommendations.length}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] flex flex-col">
      <Card className="flex-1 flex flex-col bg-[#0C1122] border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8EE3FF] to-[#0066FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-white text-lg">Assistant AURION</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          {/* Recommandations */}
          {recommendations.length > 0 && (
            <div className="p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Recommandations</span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {recommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => handleAcceptRecommendation(rec)}
                  >
                    <p className="text-xs font-medium text-white mb-1">{rec.title}</p>
                    <p className="text-xs text-white/60 line-clamp-2">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-[#0066FF] text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-[#0066FF] hover:bg-[#0052CC]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

