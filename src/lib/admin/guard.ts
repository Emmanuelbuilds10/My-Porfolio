import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/queries";
import type { ActionResult } from "@/lib/types";

/**
 * Second of the three auth checks (proxy → action → RLS). Every Server Action
 * calls this before touching data and bails on a non-null result.
 *
 * With no Supabase configured the admin is a read-only demo, so the guard always
 * refuses — nothing can be written to a database that isn't there.
 */
export async function adminGuard(): Promise<ActionResult | null> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "Demo mode is read-only — changes aren't saved. Configure Supabase to edit.",
    };
  }

  const user = await getAdminUser();
  return user
    ? null
    : { ok: false, message: "Your session has expired. Please sign in again." };
}
