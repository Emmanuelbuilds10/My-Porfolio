"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth";
import { signInSchema } from "@/lib/admin/schemas";
import { isSupabaseConfigured } from "@/lib/queries";
import { createAuthClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

/** Email/password sign-in. Non-admin accounts are signed straight back out. */
export async function signIn(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase isn't configured yet — set your env vars first." };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createAuthClient();
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
