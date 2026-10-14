"use server";

import { redirect } from "next/navigation";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { isAdminEmail } from "@/lib/auth";
import { signInSchema } from "@/lib/admin/schemas";
import { isSupabaseConfigured } from "@/lib/queries";
import { createAuthClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

/**
 * Email/password sign-in. Non-admin accounts are signed straight back out.
 *
 * Attempts are rate limited per address: ten per fifteen minutes, which leaves
 * room for typos without letting a script walk a password list. The message is
 * deliberately identical for a bad password and an unknown account, so the form
 * cannot be used to discover which addresses exist.
 */
export async function signIn(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase isn't configured yet — set your env vars first." };
  }

  const limit = rateLimit(await clientKey("login"), 10, 15 * 60_000);
  if (!limit.ok) {
    return {
      ok: false,
      message: `Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minute(s).`,
    };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createAuthClient();
  // Supabase Auth hashes and verifies the password server-side (bcrypt); this
  // app never sees, stores or compares a password itself.
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { ok: false, message: "Those credentials didn't work. Try again." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    await supabase.auth.signOut();
    return { ok: false, message: "That account doesn't have access to the admin." };
  }

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createAuthClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
