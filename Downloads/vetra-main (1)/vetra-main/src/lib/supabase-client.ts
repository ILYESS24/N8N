'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

let supabase: SupabaseClient<Database> | null = null;

export const getSupabaseBrowserClient = () => {
  // Valeurs par défaut (fallback)
  const defaultUrl = 'https://gvfuxlqvfvqdqhzjkyok.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZnV4bHF2ZnZxZHFoempreW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTkyNzgsImV4cCI6MjA3ODk5NTI3OH0.y0f05lxJevY7wkS82FW2y2Kz4GbUauWzn0enH8-rDmE';
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultKey;
  
  // Validation de l'URL
  if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    console.error('Invalid Supabase URL:', supabaseUrl);
    throw new Error(
      'Invalid Supabase URL. Must be a valid HTTP or HTTPS URL.'
    );
  }

  if (!supabase) {
    supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabase;
};

