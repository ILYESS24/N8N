"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, CheckCircle2, Code, Database, Workflow } from "lucide-react";
import { apiRequest } from "@/lib/api-client";

export function AIAutonomousGenerator() {
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "saas" as "saas" | "website" | "app" | "api",
    features: "",
  });

  const handleGenerate = async () => {
    if (!formData.description.trim()) {
      alert("Veuillez entrer une description du projet");
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("/api/ai/generate", {
        method: "POST",
        body: JSON.stringify({
          type: "autonomous",
          task: "project",
          name: formData.name || "Generated Project",
          description: formData.description,
          projectType: formData.type,
          features: formData.features.split(",").map((f) => f.trim()).filter(Boolean),
        }),
      });

      setProject(response.project);
    } catch (error: any) {
      console.error("Generation error:", error);
      alert(`Erreur: ${error.message || "Génération échouée"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Générateur IA Autonome
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom du projet</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Mon SaaS"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre projet en détail..."
              className="bg-white/5 border-white/10 text-white min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Type de projet</Label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white"
            >
              <option value="saas">SaaS</option>
              <option value="website">Site Web</option>
              <option value="app">Application</option>
              <option value="api">API</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Fonctionnalités (séparées par des virgules)</Label>
            <Input
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Authentification, Paiements, Dashboard, API REST"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !formData.description.trim()}
            className="w-full bg-white text-black hover:bg-white/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer le projet complet
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {project && (
        <div className="space-y-4">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Projet généré avec succès
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="w-4 h-4" />
                    <span className="font-semibold">Frontend</span>
                  </div>
                  <p className="text-sm text-white/60">
                    {project.frontend?.structure?.length || 0} fichiers générés
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4" />
                    <span className="font-semibold">Backend</span>
                  </div>
                  <p className="text-sm text-white/60">
                    {project.backend?.structure?.length || 0} fichiers générés
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Workflow className="w-4 h-4" />
                    <span className="font-semibold">Workflow</span>
                  </div>
                  <p className="text-sm text-white/60">
                    {project.workflow ? "Workflow généré" : "Aucun workflow"}
                  </p>
                </div>
              </div>

              {project.documentation && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Documentation</h3>
                  <pre className="text-xs text-white/80 whitespace-pre-wrap overflow-auto max-h-64">
                    {project.documentation}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

