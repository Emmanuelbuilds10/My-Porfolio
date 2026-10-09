"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { adminGuard } from "@/lib/admin/guard";
import { invalid, type SaveResult } from "@/lib/admin/schemas";
import { createAuthClient } from "@/lib/supabase/server";

const landingImageSchema = z.object({
  id: z.uuid().optional(),
  imageUrl: z
    .string()
    .trim()
    .min(1, "An image is required.")
    .max(2048, "Keep the URL under 2048 characters."),
  alt: z.string().trim().max(200).default(""),
  sortOrder: z.coerce.number().int().min(0).max(999).optional(),
});

/** Re-render wherever the marquee (and its admin screen) appears. */
function revalidateMarquee() {
  revalidatePath("/");
  revalidatePath("/admin/marquee");
}

export async function saveLandingImage(values: {
  id?: string;
  imageUrl: string;
  alt: string;
  sortOrder?: number;
}): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const parsed = landingImageSchema.safeParse(values);
  if (!parsed.success) {
    const result = invalid(parsed.error);
    return { ok: false, message: result.message, fieldErrors: result.fieldErrors };
  }

  const { id, imageUrl, alt, sortOrder } = parsed.data;
  const supabase = await createAuthClient();

  if (id) {
    const { error } = await supabase
      .from("landing_images")
      .update({ image_url: imageUrl, alt })
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
    revalidateMarquee();
    return { ok: true, message: "Image saved.", id };
  }

  // New tiles go to the end of the strip.
  const { data: last } = await supabase
    .from("landing_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();

  const { data, error } = await supabase
    .from("landing_images")
    .insert({
      image_url: imageUrl,
      alt,
      sort_order: sortOrder || (last?.sort_order ?? 0) + 1,
    })
    .select("id")
    .single<{ id: string }>();

  if (error) return { ok: false, message: error.message };

  revalidateMarquee();
  return { ok: true, message: "Image added.", id: data.id };
}

/** Persist a drag reorder: index in the array becomes sort_order. */
export async function reorderLandingImages(ids: string[]): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const supabase = await createAuthClient();
  const results = await Promise.all(
    ids.map((id, index) =>
      supabase.from("landing_images").update({ sort_order: index + 1 }).eq("id", id),
    ),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) return { ok: false, message: failed.error.message };

  revalidateMarquee();
  return { ok: true, message: "Order saved." };
}

export async function deleteLandingImage(id: string): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const { error } = await (await createAuthClient())
    .from("landing_images")
    .delete()
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidateMarquee();
  return { ok: true, message: "Image removed." };
}
