"use server";

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

  // TODO(Phase 5): insert into `subscribers` (conflict on email = already
  // subscribed) and send the welcome email, then return SUCCESS.
  return {
    ok: false,
    message: "The newsletter isn't connected to the database yet — that lands in Phase 5.",
  };
}
