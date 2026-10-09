import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase clients.
 *
 * Two flavours, because they have different jobs:
 *
 *  - `createAuthClient()`  — reads the login cookies, used in Server Actions
 *                            and route handlers where the user's identity
 *                            matters (Phase 4 admin).
 *  - `createPublicClient()` — no cookies at all. Public pages are statically
 *                            rendered, and touching `cookies()` there either
 *                            forces every page dynamic or throws during
 *                            prerender. The anon key can only ever see what
 *                            RLS allows, which is exactly the public read.
 *
 * The service-role key is NEVER used here and never imported client-side.
 */
export async function createAuthClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — middleware refreshes instead.
          }
        },
      },
    },
  );
}

let publicClient: SupabaseClient | null = null;

/** Shared anon client for Server Components. Safe under static rendering. */
export function createPublicClient(): SupabaseClient {
  publicClient ??= createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  return publicClient;
}
