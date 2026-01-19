/**
 * Supabase Server Client
 *
 * Creates a Supabase client for use in Server Components and API routes.
 * Handles cookie-based authentication for server-side rendering.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Creates a Supabase client for server-side usage.
 * Call this function in Server Components, API routes, or Server Actions.
 *
 * @example
 * // In a Server Component
 * import { createClient } from '@/lib/supabase/server';
 *
 * async function MyServerComponent() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('profiles').select('*');
 * }
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Gets the current authenticated user from the server.
 * Returns null if no user is logged in.
 *
 * @example
 * const user = await getUser();
 * if (user) {
 *   console.log('Logged in as:', user.email);
 * }
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Gets the current session from the server.
 * Returns null if no session exists.
 */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
