import { site } from "@/lib/site";

/**
 * The facts the legal pages are built from.
 *
 * Everything here is the single source of truth for the policies — change a
 * value once and all three pages follow. Two of them are placeholders that
 * describe *you*, not the code, so confirm them before launch:
 *
 *  - `controller` — the person (or registered business) responsible for the
 *    data. A trading name is enough while you are a sole trader; swap in a
 *    registered company name and number once you have one.
 *  - `jurisdiction` — which country's law governs the terms. Defaulted to
 *    Nigeria from the phone number on the site; change it if that is wrong.
 */
export const legal = {
  /** Trading name the policies refer to ("we"/"I"). */
  controller: site.name,
  /** Where the controller can be reached about anything on these pages. */
  email: site.email,
  /** Business location shown to visitors. */
  location: site.location,
  /** Country whose law governs the terms. */
  jurisdiction: "the Federal Republic of Nigeria",
  /** Shown as "Last updated" on all three pages — bump when you edit copy. */
  lastUpdated: "14 October 2026",
  /** The three policies, in the order they appear in the footer. */
  documents: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
} as const;
