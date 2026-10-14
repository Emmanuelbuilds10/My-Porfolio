import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Columns that the code knows about but the database may not have yet.
 *
 * PostgREST rejects the WHOLE request when one name in a select list is
 * unknown, so a database that is a migration behind does not fail gracefully —
 * it empties every list. `gallery` arrived with
 * `supabase/migrations/006_content_gallery.sql`, and until that migration is
 * applied a `select` naming it takes the Writing archive, the Projects archive
 * and every admin save down with it.
 *
 * So the app probes for the column once per server process and trims it out of
 * the projection while the migration is outstanding, printing a warning so the
 * drift is still visible instead of silent.
 */

type PgError = { code?: string; message?: string } | null | undefined;

/**
 * True for Postgres `42703` (no such column) and PostgREST `PGRST204` (the
 * column is not in its schema cache) — the two ways a missing column surfaces.
 */
export function isMissingColumn(error: PgError): boolean {
  if (!error) return false;
  if (error.code === "42703" || error.code === "PGRST204") return true;
  return /column .* does not exist/i.test(error.message ?? "");
}

/** table.column -> supported. Probed once per process. */
const cache = new Map<string, boolean>();

const warnings = new Set<string>();

/** Whether `table.column` exists in this database. */
export async function hasColumn(
  client: SupabaseClient,
  table: string,
  column: string,
): Promise<boolean> {
  const key = `${table}.${column}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  // A missing column fails the query whether or not any row is visible, so an
  // empty result still means "the column is there".
  const { error } = await client.from(table).select(column).limit(1);
  const supported = !isMissingColumn(error);

  if (!supported && !warnings.has(key)) {
    warnings.add(key);
    console.warn(
      `[content-columns] ${key} is missing — run the pending migration in ` +
        `supabase/migrations (006_content_gallery.sql adds content.gallery). ` +
        `Serving content without it until then.`,
    );
  }

  cache.set(key, supported);
  return supported;
}

/**
 * A select list, trimmed to the columns this database actually has.
 *
 * The trimmed names are written as `, gallery` in the projections below, so a
 * plain string replace is enough (a naive comma split would break the
 * `categories(id, name, slug)` embed).
 */
export async function contentSelect(
  client: SupabaseClient,
  select: string,
): Promise<string> {
  if (await hasColumn(client, "content", "gallery")) return select;
  return select.replace(", gallery", "");
}
