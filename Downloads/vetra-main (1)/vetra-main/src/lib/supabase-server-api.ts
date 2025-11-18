import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gvfuxlqvfvqdqhzjkyok.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZnV4bHF2ZnZxZHFoempreW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTkyNzgsImV4cCI6MjA3ODk5NTI3OH0.y0f05lxJevY7wkS82FW2y2Kz4GbUauWzn0enH8-rDmE';

export const getSupabaseServerClient = () => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export const getAuthenticatedUser = async (request: NextRequest) => {
  const supabase = getSupabaseServerClient();
  
  // Try to get token from Authorization header (preferred method)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      // Create a client with this token for RLS
      const authenticatedSupabase = createClient<Database>(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        }
      );
      return { user, supabase: authenticatedSupabase };
    }
  }
  
  // Try to get from cookies (for browser requests with session)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;
  if (accessToken) {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!error && user) {
      const authenticatedSupabase = createClient<Database>(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        }
      );
      return { user, supabase: authenticatedSupabase };
    }
  }
  
  return { user: null, supabase };
};

