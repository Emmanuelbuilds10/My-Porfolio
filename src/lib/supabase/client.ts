"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser client for Client Components (the Phase 4 admin UI). Only the
 * public URL + anon key are used — the service role key never reaches the
 * browser, and RLS constrains what the anon key can do.
 */
let client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  client ??= createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return client;
}
