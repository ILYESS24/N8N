"use client";

import { useEffect, useRef, useState } from "react";
import { getAuthenticatedToolUrl } from "@/lib/tool-auth";

interface ToolIframeWrapperProps {
  baseUrl: string;
  toolName: string;
  params?: Record<string, string>;
  title: string;
}

/**
 * Wrapper pour les iframes d'outils avec authentification et communication
 * Permet la synchronisation des données entre AURION et les outils
 */
export function ToolIframeWrapper({
  baseUrl,
  toolName,
  params,
  title,
}: ToolIframeWrapperProps) {
  const [toolUrl, setToolUrl] = useState<string>(baseUrl);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Générer l'URL authentifiée
    getAuthenticatedToolUrl(baseUrl, params).then((url) => {
      setToolUrl(url);
      setLoading(false);
    });
  }, [baseUrl, params]);

  useEffect(() => {
    // Écouter les messages depuis l'iframe (postMessage)
    const handleMessage = async (event: MessageEvent) => {
      // Vérifier l'origine pour la sécurité (optionnel, peut être désactivé pour cross-origin)
      try {
        const baseUrlHost = new URL(baseUrl).hostname;
        if (!event.origin.includes(baseUrlHost) && !baseUrlHost.includes('vercel.app') && !baseUrlHost.includes('pages.dev')) {
          // Autoriser les domaines Vercel et Cloudflare Pages
          return;
        }
      } catch (e) {
        // Si l'URL n'est pas valide, on accepte quand même (pour développement)
      }

      const { type, payload } = event.data;

      switch (type) {
        case 'aurion:save':
          // Sauvegarder les données depuis l'outil
          try {
            const response = await fetch('/api/tools/data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tool: toolName,
                type: payload.type || 'workspace',
                data: payload.data,
                title: payload.title,
              }),
            });
            const result = await response.json();
            
            // Envoyer confirmation à l'iframe
            iframeRef.current?.contentWindow?.postMessage(
              { type: 'aurion:save:success', payload: result },
              baseUrl
            );
          } catch (error) {
            iframeRef.current?.contentWindow?.postMessage(
              { type: 'aurion:save:error', payload: { error: String(error) } },
              baseUrl
            );
          }
          break;

        case 'aurion:load':
          // Charger les données pour l'outil
          try {
            const response = await fetch(
              `/api/tools/data?tool=${toolName}&type=${payload.type || 'workspace'}`
            );
            const result = await response.json();
            
            // Envoyer les données à l'iframe
            iframeRef.current?.contentWindow?.postMessage(
              { type: 'aurion:load:success', payload: result },
              baseUrl
            );
          } catch (error) {
            iframeRef.current?.contentWindow?.postMessage(
              { type: 'aurion:load:error', payload: { error: String(error) } },
              baseUrl
            );
          }
          break;

        case 'aurion:track':
          // Tracker une activité depuis l'outil
          try {
            await fetch('/api/activity', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                activity_type: payload.activity_type,
                tool_name: toolName,
                activity_data: payload.data,
              }),
            });
          } catch (error) {
            console.error('Error tracking activity:', error);
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [baseUrl, toolName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/60">Chargement de {title}...</div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={toolUrl}
      className="w-full h-full border-0"
      title={title}
      allow="clipboard-read; clipboard-write"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
    />
  );
}

