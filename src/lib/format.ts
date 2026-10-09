/**
 * Date + reading-time formatting.
 *
 * Every formatter pins `timeZone: "UTC"` and an explicit locale so the server
 * and the client always render the same string (no hydration mismatch) and a
 * post never appears to change date depending on where it is read.
 */

const CARD_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const FULL_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const MONTH_YEAR = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** `2026-08-28` -> `AUG 28` — the compact meta line on cards. */
export function formatCardDate(iso: string) {
  return CARD_DATE.format(new Date(iso)).toUpperCase();
}

/** `2026-08-28` -> `AUG 28, 2026` — the meta line on detail pages. */
export function formatFullDate(iso: string) {
  return FULL_DATE.format(new Date(iso)).toUpperCase();
}

/** `2026-08-28` -> `AUG 2026` — admin tables, where space is tight. */
export function formatMonthYear(iso: string) {
  return MONTH_YEAR.format(new Date(iso)).toUpperCase();
}

/** `6` -> `6 min read` */
export function formatReadTime(minutes: number | null | undefined) {
  if (!minutes || minutes < 1) return "1 min read";
  return `${minutes} min read`;
}

/** `AUG 28, 2026 • 6 min read` — the combined meta line. */
export function formatPostMeta(iso: string, readTime: number | null) {
  return [formatFullDate(iso), formatReadTime(readTime)].join(" • ");
}

export const WORDS_PER_MINUTE = 200;

/**
 * Reading time estimate from a markdown body. Strips fenced code, markdown
 * syntax and HTML so images and syntax don't inflate the count.
 */
export function estimateReadTime(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Trim an excerpt to a whole word and add an ellipsis when it was cut. */
export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}
