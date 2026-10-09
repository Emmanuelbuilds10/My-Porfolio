import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Standalone client for scripts (seed, future maintenance tasks).
 * Runs outside Next.js, so it reads the env directly — loading .env.local via
 * Node's built-in loader when the vars aren't already set.
 * Requires SUPABASE_SERVICE_ROLE_KEY: RLS is bypassed for seeding, which is
 * what allows the idempotent upserts of public content.
 */
export function createScriptClient(): SupabaseClient {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    try {
      // Node >= 20.12. Does not override variables that are already set.
      process.loadEnvFile(".env.local");
    } catch {
      // No .env.local present — the missing-var error below covers it.
    }
    url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing environment variables. Set NEXT_PUBLIC_SUPABASE_URL and\n" +
        "SUPABASE_SERVICE_ROLE_KEY in .env.local (see .env.example), then rerun.",
    );
    process.exit(1);
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
