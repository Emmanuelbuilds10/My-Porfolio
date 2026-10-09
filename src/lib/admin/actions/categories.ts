"use server";

import { revalidatePath } from "next/cache";
import { adminGuard } from "@/lib/admin/guard";
import { categorySchema, invalid, type SaveResult } from "@/lib/admin/schemas";
import { createAuthClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/validation";

function revalidateCategories() {
  revalidatePath("/writing");
  revalidatePath("/admin");
}

/** Find an unused slug derived from `name` (appends -2, -3 … on collision). */
async function uniqueSlug(supabase: Awaited<ReturnType<typeof createAuthClient>>, name: string) {
  const base = slugify(name) || `category-${Date.now()}`;
  let slug = base;
  for (let suffix = 2; suffix < 50; suffix += 1) {
    const { data } = await supabase.from("categories").select("id").eq("slug", slug).limit(1);
    if (!data?.length) return slug;
    slug = `${base}-${suffix}`;
  }
  return `${base}-${Date.now()}`;
}

export async function createCategory(values: { name: string }): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    const result = invalid(parsed.error);
    return { ok: false, message: result.message, fieldErrors: result.fieldErrors };
  }

  const supabase = await createAuthClient();
  const slug = await uniqueSlug(supabase, parsed.data.name);

  const { data, error } = await supabase
    .from("categories")
    .insert({ name: parsed.data.name, slug })
    .select("id")
    .single<{ id: string }>();

  if (error) return { ok: false, message: error.message };

  revalidateCategories();
  return { ok: true, message: "Category created.", id: data.id };
}

/** Rename keeps the slug stable so existing /writing?category= links survive. */
export async function renameCategory(id: string, name: string): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const parsed = categorySchema.safeParse({ id, name });
  if (!parsed.success) {
    const result = invalid(parsed.error);
    return { ok: false, message: result.message, fieldErrors: result.fieldErrors };
  }

  const { error } = await (await createAuthClient())
    .from("categories")
    .update({ name: parsed.data.name })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidateCategories();
  return { ok: true, message: "Category renamed." };
}

/**
 * Delete a category. When posts still reference it, the caller must pass a
 * `reassignTo` category id; those posts are moved first.
 */
export async function deleteCategory(
  id: string,
  reassignTo?: string | null,
): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const supabase = await createAuthClient();
  const { count } = await supabase
    .from("content")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  const inUse = count ?? 0;
  if (inUse > 0) {
    if (!reassignTo || reassignTo === id) {
      return {
        ok: false,
        message: `This category is used by ${inUse} item(s). Choose where to move them first.`,
      };
    }
    const { error: moveError } = await supabase
      .from("content")
      .update({ category_id: reassignTo })
      .eq("category_id", id);
    if (moveError) return { ok: false, message: moveError.message };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateCategories();
  return { ok: true, message: "Category deleted." };
}
