"use server";

import { clientKey, rateLimit } from "@/lib/rate-limit";
import { createPublicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/queries";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import type { ActionResult } from "@/lib/types";

/** Copy is identical for new and repeat signups so we never leak who is subscribed. */
const SUCCESS: ActionResult = {
  ok: true,
  message: "You're on the list. Check your inbox for a welcome note.",
};

/**
 * Newsletter signup.
 *
 * Phase 1 ships the validation, honeypot and result contract so the form's
 * whole UX can be built and reviewed. Phase 5 adds the two side effects:
 * insert the row into `subscribers`, then send the welcome email.
 */
export async function subscribe(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  // Five signups per address per ten minutes, before the honeypot so a bot
  // cannot spend someone else's budget and a script cannot walk the list.
  const limit = rateLimit(await clientKey("newsletter"), 5, 10 * 60_000);
  if (!limit.ok) {
    return {
      ok: false,
      message: `Too many attempts from this connection. Try again in ${limit.retryAfterSeconds}s.`,
    };
  }

  // Honeypot. A real person cannot see or reach this field, so anything in it
  // is a bot — return the success shape and drop the submission.
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) return SUCCESS;

  const email = normalizeEmail(String(formData.get("email") ?? ""));

  if (!email) {
    return { ok: false, message: "Enter your email address to subscribe." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "That doesn't look like a valid email address." };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: "The newsletter isn't connected to the database yet.",
    };
  }

  // A repeat email hits the unique index; that counts as success — the copy
  // is identical for new and existing subscribers so nobody can probe who is
  // on the list. Welcome-email sending stays a follow-up (needs a mail key).
  const { error } = await createPublicClient()
    .from("subscribers")
    .insert({ email });

  if (error && error.code !== "23505") {
    console.error("subscribe:", error.message);
    return {
      ok: false,
      message: "Could not subscribe right now — please try again in a moment.",
    };
  }

  return SUCCESS;
}
