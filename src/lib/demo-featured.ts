import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ContentItem } from "@/lib/types";

/**
 * Demo-mode persistence for the `featured` flag ("show on the landing page").
 *
 * The demo admin refuses database writes because there is no database — but
 * choosing the landing-page projects is the one decision that is useless if it
 * evaporates on refresh. This store keeps those marks in a small JSON file at
 * the project root (gitignored), so the toggle works end to end in demo mode
 * and disappears the moment Supabase is configured.
 *
 * Only `featured` is stored; every other field stays fixture-read-only.
 * Server-only: reads `node:fs`, so nothing client-side may import this.
 */

const STORE_PATH = path.join(process.cwd(), ".demo-featured.json");

/** id -> featured override. Missing id means "use the fixture default". */
export function readFeaturedOverrides(): Record<string, boolean> {
  try {
    const parsed: unknown = JSON.parse(readFileSync(STORE_PATH, "utf8"));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const overrides: Record<string, boolean> = {};
      for (const [id, value] of Object.entries(parsed)) {
        if (typeof value === "boolean") overrides[id] = value;
      }
      return overrides;
    }
    return {};
  } catch {
    // Missing or corrupt file: fixtures win, same as a fresh checkout.
    return {};
  }
}

/** Persist one item's landing-page mark. */
export function writeFeaturedOverride(id: string, featured: boolean): void {
  const overrides = readFeaturedOverrides();
  overrides[id] = featured;
  writeFileSync(STORE_PATH, `${JSON.stringify(overrides, null, 2)}\n`, "utf8");
}

/** Apply stored marks on top of fixture content (id lookups only). */
export function applyFeaturedOverrides<T extends Pick<ContentItem, "id" | "featured">>(
  items: T[],
): T[] {
  const overrides = readFeaturedOverrides();
  if (Object.keys(overrides).length === 0) return items;
  return items.map((item) =>
    item.id in overrides ? { ...item, featured: overrides[item.id] } : item,
  );
}
