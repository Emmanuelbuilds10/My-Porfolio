"use server";

import { revalidatePath } from "next/cache";
import { getAdminUser, isDemoMode } from "@/lib/auth";
import { writeFeaturedOverride } from "@/lib/demo-featured";
import { slugExists } from "@/lib/admin/data";
import { adminGuard } from "@/lib/admin/guard";
import { revalidateContent } from "@/lib/admin/revalidate";
import {
  contentSchema,
  invalid,
  type ContentValues,
  type SaveResult,
} from "@/lib/admin/schemas";
import { createAuthClient } from "@/lib/supabase/server";
import type { ContentType, PublishStatus } from "@/lib/types";

/** `2026-10-05T14:30` (datetime-local) or an ISO string -> ISO, else null. */
function toIso(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function statusMessage(status: PublishStatus) {
  if (status === "published") return "Published.";
  if (status === "scheduled") return "Scheduled.";
  return "Draft saved.";
}

/**
 * The single write path for the unified editor. Creates when there is no id,
 * updates otherwise, and clears the type-specific columns the other type owns
 * so a post can never keep a stale tech stack.
 */
export async function saveContent(values: ContentValues): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const parsed = contentSchema.safeParse(values);
  if (!parsed.success) {
    const result = invalid(parsed.error);
    return { ok: false, message: result.message, fieldErrors: result.fieldErrors };
  }

  const data = parsed.data;

  if (await slugExists(data.slug, data.id)) {
    return {
      ok: false,
      message: "That slug is already in use.",
      fieldErrors: { slug: "That slug is already in use." },
    };
  }

  const status = data.publishStatus;
  let publishedAt = toIso(data.publishedAt);
  if (status === "published" && !publishedAt) publishedAt = new Date().toISOString();
  if (status === "scheduled") {
    if (!publishedAt || new Date(publishedAt).getTime() <= Date.now()) {
      return {
        ok: false,
        message: "Pick a future date and time to schedule this item.",
        fieldErrors: { publishedAt: "Pick a future date and time." },
      };
    }
  }

  const isPost = data.type === "post";

  const row = {
    type: data.type,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    body: data.body,
    cover_image_url: data.coverImageUrl || null,
    alt_text: data.altText || null,
    category_id: isPost ? data.categoryId : null,
    tags: isPost ? data.tags : [],
    tech_stack: isPost ? [] : data.techStack,
    live_url: isPost ? null : data.liveUrl || null,
    repo_url: isPost ? null : data.repoUrl || null,
    project_status: isPost ? null : (data.projectStatus ?? "in-progress"),
    featured: data.featured,
    publish_status: status,
    published_at: publishedAt,
  };

  const supabase = await createAuthClient();
  let id = data.id;
  let previousSlug: string | undefined;

  if (id) {
    const { data: existing } = await supabase
      .from("content")
      .select("slug")
      .eq("id", id)
      .maybeSingle<{ slug: string }>();
    previousSlug = existing?.slug;

    const { error } = await supabase.from("content").update(row).eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { data: inserted, error } = await supabase
      .from("content")
      .insert(row)
      .select("id")
      .single<{ id: string }>();
    if (error) return { ok: false, message: error.message };
    id = inserted.id;
  }

  revalidateContent(data.type, data.slug, previousSlug);
  return { ok: true, message: statusMessage(status), id };
}

/**
 * Quick "show on the landing page" toggle for a project.
 *
 * This is the one write the demo admin allows: the mark is stored in a local
 * JSON file instead of the database, so choosing landing-page projects works
 * end to end before Supabase exists. Configured deployments go through the
 * normal guard → RLS path.
 */
export async function toggleFeatured(id: string, featured: boolean): Promise<SaveResult> {
  if (isDemoMode()) {
    writeFeaturedOverride(id, featured);
    revalidatePath("/");
    revalidatePath("/admin");
    return {
      ok: true,
      message: featured
        ? "Added to the landing page."
        : "Removed from the landing page.",
    };
  }

  const denied = await adminGuard();
  if (denied) return denied;

  const supabase = await createAuthClient();
  const { data: existing, error: readError } = await supabase
    .from("content")
    .select("type, slug")
    .eq("id", id)
    .maybeSingle<{ type: ContentType; slug: string }>();

  if (readError || !existing) {
    return { ok: false, message: "That item no longer exists." };
  }

  const { error } = await supabase.from("content").update({ featured }).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateContent(existing.type, existing.slug);
  return {
    ok: true,
    message: featured ? "Added to the landing page." : "Removed from the landing page.",
  };
}

/** Quick Publish / Unpublish from the dashboard row. */
export async function togglePublish(id: string, publish: boolean): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const supabase = await createAuthClient();
  const { data: existing, error: readError } = await supabase
    .from("content")
    .select("type, slug, published_at")
    .eq("id", id)
    .maybeSingle<{ type: ContentType; slug: string; published_at: string | null }>();

  if (readError || !existing) {
    return { ok: false, message: "That item no longer exists." };
  }

  const patch = publish
    ? {
        publish_status: "published" as const,
        published_at: existing.published_at ?? new Date().toISOString(),
      }
    : { publish_status: "draft" as const };

  const { error } = await supabase.from("content").update(patch).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidateContent(existing.type, existing.slug);
  return { ok: true, message: publish ? "Published." : "Moved back to draft." };
}

export async function deleteContent(id: string): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const supabase = await createAuthClient();
  const { data: existing } = await supabase
    .from("content")
    .select("type, slug")
    .eq("id", id)
    .maybeSingle<{ type: ContentType; slug: string }>();

  const { error } = await supabase.from("content").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  if (existing) revalidateContent(existing.type, existing.slug);
  return { ok: true, message: "Deleted." };
}

/** Live slug availability used by the editor (debounced on the client). */
export async function checkSlug(
  slug: string,
  excludeId?: string,
): Promise<{ available: boolean }> {
  const user = await getAdminUser();
  if (!user) return { available: false };

  const value = slug.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return { available: false };
  return { available: !(await slugExists(value, excludeId)) };
}
