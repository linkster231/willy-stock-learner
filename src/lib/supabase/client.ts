/**
 * Supabase Browser Client
 *
 * Creates a Supabase client for use in Client Components (browser).
 * This client handles authentication state and real-time subscriptions.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Creates a Supabase client for browser-side usage.
 * Call this function in Client Components to interact with Supabase.
 *
 * @example
 * 'use client';
 * import { createClient } from '@/lib/supabase/client';
 *
 * function MyComponent() {
 *   const supabase = createClient();
 *   // Use supabase to query, subscribe, etc.
 * }
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
