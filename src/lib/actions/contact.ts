"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/queries";
import { isValidEmail, normalizeEmail } from "@/lib/validation";
import { site } from "@/lib/site";
import type { ActionResult } from "@/lib/types";

/**
 * Landing contact form.
 *
 * Validates and screens the submission (honeypot), then inserts it into the
 * `messages` table — the public INSERT policy is all the anon key needs, and
 * with no SELECT policy submissions can't be scraped back out. Without a
 * database the form still answers, pointing at email as the fallback.
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
  const phone = String(formData.get("phone") ?? "").trim();
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

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      message: `The contact form isn't connected yet — email me at ${site.email}.`,
    };
  }

  const { error } = await createPublicClient().from("messages").insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    console.error("sendMessage:", error.message);
    return {
      ok: false,
      message: `The message could not be delivered right now — email me at ${site.email}.`,
    };
  }

  return { ok: true, message: "Message sent — I'll get back to you soon." };
}
