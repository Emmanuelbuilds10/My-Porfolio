"use server";

import { isValidEmail, normalizeEmail } from "@/lib/validation";
import { site } from "@/lib/site";
import type { ActionResult } from "@/lib/types";

/**
 * Landing contact form.
 *
 * Validates and screens the submission (honeypot) so the whole UX can be built
 * and reviewed, then hands off. Persistence is not wired yet — there is no
 * `messages` table — so a valid message returns a clear pointer to email rather
 * than silently pretending it was delivered.
 */
export async function sendMessage(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  // Honeypot. A real person cannot see or reach this field, so anything in it
  // is a bot — return the success shape and drop the submission.
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot) return { ok: true, message: "Thanks — your message is on its way." };

  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const message = String(formData.get("message") ?? "").trim();

  if (!firstName || !lastName) {
    return { ok: false, message: "Add your first and last name." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "That doesn't look like a valid email address." };
  }

  if (!message) {
    return { ok: false, message: "Tell me a little about your project." };
  }

  // TODO: persist to a `messages` table (or send a notification email) and
  // return the success shape once the message has actually been stored.
  return {
    ok: false,
    message: `The contact form isn't connected yet — email me at ${site.email}.`,
  };
}
