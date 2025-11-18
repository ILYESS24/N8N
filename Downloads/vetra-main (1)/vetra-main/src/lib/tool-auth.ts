'use client';

import { getSupabaseBrowserClient } from './supabase-client';

/**
 * Génère un token d'authentification pour les outils intégrés
 * Ce token permet aux outils d'identifier l'utilisateur et d'accéder à ses données
 */
export async function generateToolAuthToken(): Promise<string | null> {
  try {
    const supabase = await import('./supabase-client').then(m => m.getSupabaseBrowserClient());
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      return null;
    }

    // Créer un token JWT simple avec l'ID utilisateur et le token Supabase
    const payload = {
      userId: session.user.id,
      email: session.user.email,
      accessToken: session.access_token,
      timestamp: Date.now(),
    };

    // Encoder en base64 (pour un vrai SaaS, utilisez JWT avec signature)
    const token = btoa(JSON.stringify(payload));
    return token;
  } catch (error) {
    console.error('Error generating tool auth token:', error);
    return null;
  }
}

/**
 * Récupère les informations utilisateur depuis le token
 */
export function parseToolAuthToken(token: string): {
  userId: string;
  email: string;
  accessToken: string;
  timestamp: number;
} | null {
  try {
    const payload = JSON.parse(atob(token));
    return payload;
  } catch (error) {
    console.error('Error parsing tool auth token:', error);
    return null;
  }
}

/**
 * Génère une URL avec authentification pour un outil
 */
export async function getAuthenticatedToolUrl(
  baseUrl: string,
  params?: Record<string, string>
): Promise<string> {
  const token = await generateToolAuthToken();
  
  if (!token) {
    return baseUrl;
  }

  const supabase = await import('./supabase-client').then(m => m.getSupabaseBrowserClient());
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user.id || '';

  const url = new URL(baseUrl);
  url.searchParams.set('aurion_token', token);
  url.searchParams.set('aurion_user_id', userId);
  
  // Ajouter l'URL de l'API seulement si on est côté client
  if (typeof window !== 'undefined') {
    url.searchParams.set('aurion_api', `${window.location.origin}/api/tools`);
  }
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

