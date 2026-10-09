import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client. SERVER ONLY.
 *
 * Bypasses RLS, so it is reserved for the few admin reads that RLS cannot
 * express for an authenticated user — the `subscribers` table has no SELECT
 * policy at all (the public may only INSERT), so listing and exporting
 * subscribers must go through this client.
 *
 * Never import this from a Client Component: the key must not reach the browser.
 */
export function createServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase service role is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** True when the service-role key is present, so callers can degrade cleanly. */
export function isServiceConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
