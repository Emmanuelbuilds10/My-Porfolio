import type { SupabaseClient } from "@supabase/supabase-js";
import { contentSelect } from "@/lib/content-columns";
import { createPublicClient } from "@/lib/supabase/server";
import type {
  Category,
  ContentItem,
  Fact,
  ProjectStatus,
  PublishStatus,
  SiteSettings,
} from "@/lib/types";
import type { ContentRow, FactRow, SiteSettingsRow } from "@/types/database";
import {
  demoGetCategories,
  demoGetFacts,
  demoGetFeaturedPost,
  demoGetFeaturedProjects,
  demoGetLatestPosts,
  demoGetPostBySlug,
  demoGetPosts,
  demoGetProjectBySlug,
  demoGetProjects,
  demoGetPublishedPostSlugs,
  demoGetPublishedProjectSlugs,
  demoGetRelatedPosts,
  demoGetRelatedProjects,
  demoGetSiteSettings,
  demoGetTechFilters,
} from "@/lib/demo";

/**
 * Typed server-side queries.
 *
 * RLS does the visibility filtering: the anon client physically cannot read
 * drafts or future-dated rows, so these functions never see them. Blog
 * functions pin `type = 'post'`; project functions pin 'project'.
 */

const CONTENT_SELECT =
  "id, type, title, slug, excerpt, body, cover_image_url, gallery, category_id, tags, tech_stack, live_url, repo_url, project_status, featured, publish_status, published_at, read_time, blur_data_url, created_at, updated_at, categories(id, name, slug)";

/**
 * The category embed forced to an inner join. PostgREST only filters the
 * parent rows by an embedded column when the embed is `!inner` — without it a
 * `?category=` filter would narrow the embedded object but leave every post in
 * the list.
 */
const innerCategoryJoin = (select: string) =>
  select.replace("categories(", "categories!inner(");

/**
 * The projection this server actually uses: `CONTENT_SELECT` minus any column
 * the database has not been migrated for. Cached per process, because probing
 * costs a round trip.
 */
let contentProjection: Promise<string> | null = null;
function projection(): Promise<string> {
  contentProjection ??= contentSelect(client(), CONTENT_SELECT);
  return contentProjection;
}

/**
 * Statuses a visitor may ever see. A `scheduled` row becomes readable the
 * moment `published_at` passes — RLS enforces the date, so the query only has
 * to admit the two statuses.
 */
const PUBLIC_STATUSES: PublishStatus[] = ["published", "scheduled"];

type ContentRowWithCategory = ContentRow & {
  categories: { id: string; name: string; slug: string } | null;
};

/** Postgres row -> domain shape (the only place snake_case is touched). */
function mapRow(row: ContentRowWithCategory): ContentItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    gallery: row.gallery ?? [],
    category: row.categories ?? null,
    tags: row.tags ?? [],
    techStack: row.tech_stack ?? [],
    liveUrl: row.live_url,
    repoUrl: row.repo_url,
    projectStatus: row.project_status,
    featured: row.featured,
    publishStatus: row.publish_status,
    publishedAt: row.published_at,
    readTime: row.read_time,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function client(): SupabaseClient {
  return createPublicClient();
}

/** Missing/invalid env handling: pages render their empty state instead of 500s. */
export function isSupabaseConfigured() {
  return (
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

// ---------------------------------------------------------------------------
// Blog queries (type = 'post')
// ---------------------------------------------------------------------------

export async function getFeaturedPost(): Promise<ContentItem | null> {
  if (!isSupabaseConfigured()) return demoGetFeaturedPost();

  const { data, error } = await client()
    .from("content")
    .select(await projection())
    .eq("type", "post")
    .eq("featured", true)
    .in("publish_status", PUBLIC_STATUSES)
    .order("published_at", { ascending: false })
    .limit(1)
    .returns<ContentRowWithCategory[]>();

  if (error) {
    console.error("getFeaturedPost:", error.message);
    return null;
  }
  return data?.length ? mapRow(data[0]) : null;
}

export async function getLatestPosts(limit = 6): Promise<ContentItem[]> {
  if (!isSupabaseConfigured()) return demoGetLatestPosts(limit);

  const { data, error } = await client()
    .from("content")
    .select(await projection())
    .eq("type", "post")
    .in("publish_status", PUBLIC_STATUSES)
    .order("published_at", { ascending: false })
    .limit(limit)
    .returns<ContentRowWithCategory[]>();

  if (error) {
    console.error("getLatestPosts:", error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export interface GetPostsOptions {
  category?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
}

/** Paginated, filtered post list. Matches the spec signature getPosts({...}). */
export async function getPosts({
  category,
  q,
  page = 1,
  pageSize = 9,
}: GetPostsOptions = {}): Promise<PagedResult<ContentItem>> {
  const empty = { items: [], total: 0, totalPages: 1, page };
  if (!isSupabaseConfigured()) return demoGetPosts({ category, q, page, pageSize });

  let query = client()
    .from("content")
    .select(category ? innerCategoryJoin(await projection()) : await projection(), {
      count: "exact",
    })
    .eq("type", "post")
    .in("publish_status", PUBLIC_STATUSES);

  if (category) query = query.eq("categories.slug", category);
  if (q) {
    const needle = `%${q.trim()}%`;
    query = query.or(`title.ilike.${needle},excerpt.ilike.${needle}`);
  }

  query = query
    .order("published_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query.returns<ContentRowWithCategory[]>();
  if (error) {
    console.error("getPosts:", error.message);
    return empty;
  }

  const total = count ?? 0;
  return {
    items: (data ?? []).map(mapRow),
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    page,
  };
}

export async function getPostBySlug(slug: string): Promise<ContentItem | null> {
  if (!isSupabaseConfigured()) return demoGetPostBySlug(slug);

  const { data, error } = await client()
    .from("content")
    .select(await projection())
    .eq("type", "post")
    .eq("slug", slug)
    .in("publish_status", PUBLIC_STATUSES)
    .limit(1)
    .returns<ContentRowWithCategory[]>();

  if (error || !data?.length) return null;
  return mapRow(data[0]);
}

/** Related posts: same category first, topped up from the general pool. */
export async function getRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit = 3,
): Promise<ContentItem[]> {
  if (!isSupabaseConfigured()) return demoGetRelatedPosts(postId, categoryId, limit);

  let query = client()
    .from("content")
    .select(await projection())
    .eq("type", "post")
    .in("publish_status", PUBLIC_STATUSES)
    .neq("id", postId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data, error } = await query.returns<ContentRowWithCategory[]>();
  if (error) {
    console.error("getRelatedPosts:", error.message);
    return [];
  }

  const related = (data ?? []).map(mapRow);
  if (related.length >= limit) return related;

  const { data: fill } = await client()
    .from("content")
    .select(await projection())
    .eq("type", "post")
    .in("publish_status", PUBLIC_STATUSES)
    .neq("id", postId)
    .order("published_at", { ascending: false })
    .limit(limit * 2)
    .returns<ContentRowWithCategory[]>();

  for (const row of fill ?? []) {
    if (related.length >= limit) break;
    if (!related.some((item) => item.id === row.id)) related.push(mapRow(row));
  }

  return related;
}

export interface CategoryWithCount extends Category {
  postCount: number;
}

/** Every category with its published-post count (zero-count ones included). */
export async function getCategories(): Promise<CategoryWithCount[]> {
  if (!isSupabaseConfigured()) return demoGetCategories();

  const { data, error } = await client()
    .from("categories")
    .select("id, name, slug, content(count)")
    .eq("content.type", "post")
    .in("content.publish_status", PUBLIC_STATUSES)
    .order("name")
    .returns<
      { id: string; name: string; slug: string; content: { count: number }[] }[]
    >();

  if (error) {
    console.error("getCategories:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    postCount: row.content?.[0]?.count ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// Project queries (type = 'project')
// ---------------------------------------------------------------------------

export interface GetProjectsOptions {
  tech?: string;
  status?: ProjectStatus;
  q?: string;
  page?: number;
  pageSize?: number;
}

export async function getProjects({
  tech,
  status,
  q,
  page = 1,
  pageSize = 9,
}: GetProjectsOptions = {}): Promise<PagedResult<ContentItem>> {
  const empty = { items: [], total: 0, totalPages: 1, page };
  if (!isSupabaseConfigured()) return demoGetProjects({ tech, status, q, page, pageSize });

  let query = client()
    .from("content")
    .select(await projection(), { count: "exact" })
    .eq("type", "project")
    .in("publish_status", PUBLIC_STATUSES);

  if (tech) query = query.contains("tech_stack", [tech]);
  if (status) query = query.eq("project_status", status);
  if (q) {
    const needle = `%${q.trim()}%`;
    query = query.or(`title.ilike.${needle},excerpt.ilike.${needle}`);
  }

  query = query
    .order("published_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query.returns<ContentRowWithCategory[]>();
  if (error) {
    console.error("getProjects:", error.message);
    return empty;
  }

  const total = count ?? 0;
  return {
    items: (data ?? []).map(mapRow),
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    page,
  };
}

export async function getProjectBySlug(slug: string): Promise<ContentItem | null> {
  if (!isSupabaseConfigured()) return demoGetProjectBySlug(slug);

  const { data, error } = await client()
    .from("content")
    .select(await projection())
    .eq("type", "project")
    .eq("slug", slug)
    .in("publish_status", PUBLIC_STATUSES)
    .limit(1)
    .returns<ContentRowWithCategory[]>();

  if (error || !data?.length) return null;
  return mapRow(data[0]);
}

export async function getFeaturedProjects(limit = 2): Promise<ContentItem[]> {
  if (!isSupabaseConfigured()) return demoGetFeaturedProjects(limit);

  const { data, error } = await client()
    .from("content")
    .select(await projection())
    .eq("type", "project")
    .eq("featured", true)
    .in("publish_status", PUBLIC_STATUSES)
    .order("published_at", { ascending: false })
    .limit(limit)
    .returns<ContentRowWithCategory[]>();

  if (error) {
    console.error("getFeaturedProjects:", error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export interface TechFilter {
  tech: string;
  count: number;
}

/** Distinct tech_stack values with published-project counts, most used first. */
export async function getTechFilters(): Promise<TechFilter[]> {
  if (!isSupabaseConfigured()) return demoGetTechFilters();

  const { data, error } = await client()
    .from("content")
    .select("tech_stack")
    .eq("type", "project")
    .in("publish_status", PUBLIC_STATUSES)
    .not("tech_stack", "is", null)
    .returns<{ tech_stack: string[] }[]>();

  if (error) {
    console.error("getTechFilters:", error.message);
    return [];
  }

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    for (const tech of row.tech_stack ?? []) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count || a.tech.localeCompare(b.tech));
}

/** Related projects ranked by the most overlap in tech_stack. */
export async function getRelatedProjects(
  projectId: string,
  limit = 3,
): Promise<ContentItem[]> {
  if (!isSupabaseConfigured()) return demoGetRelatedProjects(projectId, limit);

  // Fetch the pool including the current row so tech_stack overlap can be
  // scored against it; the current project is excluded below.
  const { data, error } = await client()
    .from("content")
    .select(await projection())
    .eq("type", "project")
    .in("publish_status", PUBLIC_STATUSES)
    .order("published_at", { ascending: false })
    .limit(24)
    .returns<ContentRowWithCategory[]>();

  if (error) {
    console.error("getRelatedProjects:", error.message);
    return [];
  }

  const current = (data ?? []).find((row) => row.id === projectId);
  const pool = (data ?? []).filter((row) => row.id !== projectId);

  return pool
    .map((row) => ({
      row,
      overlap: (row.tech_stack ?? []).filter((tech) =>
        (current?.tech_stack ?? []).includes(tech),
      ).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ row }) => mapRow(row));
}

/** Slugs of every published post — powers generateStaticParams. */
export async function getPublishedPostSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return demoGetPublishedPostSlugs();

  const { data, error } = await client()
    .from("content")
    .select("slug")
    .eq("type", "post")
    .in("publish_status", PUBLIC_STATUSES)
    .returns<{ slug: string }[]>();

  if (error) {
    console.error("getPublishedPostSlugs:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.slug);
}

/** Slugs of every published project — powers generateStaticParams. */
export async function getPublishedProjectSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return demoGetPublishedProjectSlugs();

  const { data, error } = await client()
    .from("content")
    .select("slug")
    .eq("type", "project")
    .in("publish_status", PUBLIC_STATUSES)
    .returns<{ slug: string }[]>();

  if (error) {
    console.error("getPublishedProjectSlugs:", error.message);
    return [];
  }
  return (data ?? []).map((row) => row.slug);
}

// ---------------------------------------------------------------------------
// Shared content: settings, facts
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured()) return demoGetSiteSettings();

  const { data, error } = await client()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .limit(1)
    .returns<SiteSettingsRow[]>();

  if (error || !data?.length) return null;
  const row = data[0];

  return {
    name: row.name,
    role: row.role,
    location: row.location,
    bioParagraphs: (row.bio ?? "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    avatarUrl: row.avatar_url,
    email: row.email,
    twitterUrl: row.twitter_url ?? "",
    githubUrl: row.github_url ?? "",
    // The stored column is still named `behance_url`, but it holds the
    // Dribbble profile URL — the footer shows it as Dribbble.
    dribbbleUrl: row.behance_url ?? "",
    linkedinUrl: (row as SiteSettingsRow).linkedin_url ?? "",
  };
}

export async function getFacts(): Promise<Fact[]> {
  if (!isSupabaseConfigured()) return demoGetFacts();

  const { data, error } = await client()
    .from("facts")
    .select("id, icon, label, value, sort_order")
    .order("sort_order")
    .returns<FactRow[]>();

  if (error) {
    console.error("getFacts:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    icon: row.icon,
    label: row.label,
    value: row.value,
    order: row.sort_order,
  }));
}
