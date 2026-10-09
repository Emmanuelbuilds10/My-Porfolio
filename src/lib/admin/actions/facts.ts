"use server";

import { adminGuard } from "@/lib/admin/guard";
import { revalidateAbout } from "@/lib/admin/revalidate";
import { factSchema, invalid, type SaveResult } from "@/lib/admin/schemas";
import { createAuthClient } from "@/lib/supabase/server";

export async function saveFact(values: {
  id?: string;
  icon: string;
  label: string;
  value: string;
  sortOrder?: number;
}): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const parsed = factSchema.safeParse(values);
  if (!parsed.success) {
    const result = invalid(parsed.error);
    return { ok: false, message: result.message, fieldErrors: result.fieldErrors };
  }

  const { id, icon, label, value, sortOrder } = parsed.data;
  const supabase = await createAuthClient();

  if (id) {
    const { error } = await supabase
      .from("facts")
      .update({ icon, label, value, sort_order: sortOrder })
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
    revalidateAbout();
    return { ok: true, message: "Fact saved.", id };
  }

  // New facts go to the end of the list.
  const { data: last } = await supabase
    .from("facts")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();

  const { data, error } = await supabase
    .from("facts")
    .insert({ icon, label, value, sort_order: sortOrder || (last?.sort_order ?? 0) + 1 })
    .select("id")
    .single<{ id: string }>();

  if (error) return { ok: false, message: error.message };

  revalidateAbout();
  return { ok: true, message: "Fact added.", id: data.id };
}

export async function deleteFact(id: string): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const { error } = await (await createAuthClient()).from("facts").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateAbout();
  return { ok: true, message: "Fact removed." };
}

/** Persist a drag reorder: index in the array becomes sort_order. */
export async function reorderFacts(ids: string[]): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const supabase = await createAuthClient();
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from("facts").update({ sort_order: index + 1 }).eq("id", id),
    ),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) return { ok: false, message: failed.error.message };

  revalidateAbout();
  return { ok: true, message: "Order saved." };
}
