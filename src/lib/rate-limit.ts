import { headers } from "next/headers";

/**
 * Rate limiting for the two public forms (contact, newsletter).
 *
 * A fixed-window counter kept in memory: `limit` requests per `windowMs` per
 * client address. That is enough to stop one script hammering a form on a
 * single-instance deployment. It is explicitly NOT a substitute for an edge
 * rate limit or WAF in front of the app — serverless instances each keep their
 * own counters, and an attacker spread across many addresses is not slowed by
 * this at all. Treat it as the cheap first line, not the only one.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Cap the map so a flood of distinct addresses cannot grow it without bound. */
const MAX_TRACKED = 5000;

function sweep(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the caller may try again (0 when allowed). */
  retryAfterSeconds: number;
}

/** Record one request for `key`. Call once per submission. */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED) sweep(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}

/**
 * Bucket key for the current request: the first `x-forwarded-for` hop (what
 * Vercel and most proxies set) with a scope so the two forms cannot spend each
 * other's budget.
 *
 * With no forwarding header — local development, or a proxy that strips it —
 * everything shares one bucket, which is the safe direction to fail.
 */
export async function clientKey(scope: string): Promise<string> {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  const address =
    forwarded?.split(",")[0]?.trim() || store.get("x-real-ip")?.trim() || "unknown";
  return `${scope}:${address}`;
}
