/** Posts per page — the Writing/Projects grid is 3 × 3. */
export const PAGE_SIZE = 9;

/** Read `?page=3` safely. Anything unparseable falls back to page 1. */
export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

/**
 * Read a single string out of a `searchParams` value, which may be an array
 * (`?tech=a&tech=b`) or absent. Mirrors Next's `string | string[] | undefined`.
 */
export function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/** Total pages for a row count — always at least one so `page` stays valid. */
export function totalPages(count: number, pageSize = PAGE_SIZE) {
  return Math.max(1, Math.ceil(count / pageSize));
}

/** Clamp an out-of-range page (e.g. `?page=99`) back inside the real range. */
export function clampPage(page: number, count: number, pageSize = PAGE_SIZE) {
  return Math.min(Math.max(1, page), totalPages(count, pageSize));
}

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Page numbers to render, with `"ellipsis"` markers: always the first and last
 * page, plus a window around the current one.
 */
export function buildPageList(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const wanted = new Set<number>([
    1,
    total,
    current - 1,
    current,
    current + 1,
  ]);
  const sorted = [...wanted]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const output: (number | "ellipsis")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) output.push("ellipsis");
    output.push(page);
  });

  return output;
}

/**
 * Build a shareable URL from filter state. Empty values are dropped so the
 * canonical URL for an unfiltered page stays bare.
 */
export function buildQueryHref(
  basePath: string,
  params: Record<string, string | number | null | undefined>,
) {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `${basePath}?${query}` : basePath;
}
