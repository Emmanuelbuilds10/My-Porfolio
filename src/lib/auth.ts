import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/queries";
import { createAuthClient } from "@/lib/supabase/server";

export interface AdminUser {
  id: string;
  email: string;
}

/** The single allowed admin address, from the server-only env. */
export function adminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
}

/** Email check used by the proxy, the layout and every Server Action. */
export function isAdminEmail(email: string | null | undefined): boolean {
  const expected = adminEmail();
  if (!expected || !email) return false;
  return email.trim().toLowerCase() === expected;
}

/**
 * The signed-in user iff they are the configured admin — `null` otherwise.
 * Returns `null` (rather than throwing) when Supabase or ADMIN_EMAIL is not
 * configured, so the login screen can explain the situation.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured() || !adminEmail()) return null;

  try {
    const supabase = await createAuthClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user?.email || !isAdminEmail(user.email)) return null;
    return { id: user.id, email: user.email };
  } catch {
    return null;
  }
}

/** For Server Actions: returns the admin or throws so no write proceeds. */
export async function assertAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) throw new Error("Not authorised.");
  return user;
}

/**
 * True when there is no Supabase to talk to, so the app runs on the built-in
 * fixtures. The admin is then viewable read-only — every write still runs
 * through `adminGuard`, which refuses in this state.
 */
export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}

/** Placeholder identity shown in the admin header while in demo mode. */
function demoAdmin(): AdminUser {
  return { id: "demo-admin", email: adminEmail() || "demo@local" };
}

/**
 * For pages/layouts: redirects to the login screen when unauthorised.
 *
 * With no Supabase configured there is no session to check and no real data to
 * protect, so the dashboard opens on sample data instead of an unreachable
 * login screen. In a configured deployment this branch is unreachable.
 */
export async function requireAdmin(): Promise<AdminUser> {
  if (isDemoMode()) return demoAdmin();
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
