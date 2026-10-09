/**
 * Validation shared by the client and the server. The server is the source of
 * truth — the client copy only exists to give instant feedback.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const MAX_EMAIL_LENGTH = 254;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  const email = normalizeEmail(value);
  return email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email);
}

/** `Hello, World!` -> `hello-world` */
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Slugs the admin must reject because they collide with real routes. */
export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "about",
  "writing",
  "projects",
  "rss",
  "sitemap",
  "robots",
  "styleguide",
]);

export function isValidSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && !RESERVED_SLUGS.has(value);
}
