import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, type PagedResult } from "@/lib/queries";
import { isServiceConfigured, createServiceClient } from "@/lib/supabase/admin";
import { createAuthClient } from "@/lib/supabase/server";
import {
  categories as fixtureCategories,
  facts as fixtureFacts,
  posts as fixturePosts,
  projects as fixtureProjects,
} from "@/content/fixtures";
import { applyFeaturedOverrides } from "@/lib/demo-featured";
import type {
  ContentItem,
  Fact,
  PublishStatus,
  ProjectStatus,
  ContentType,
} from "@/lib/types";

/**
 * Admin reads.
 *
 * Content/categories/facts/settings go through the authenticated client: the
 * database's `is_admin()` policy is what lets drafts through, so the app never
 * needs the service role for them. Subscribers are the exception — they have no
 * SELECT policy at all, so they use the service client.
 */

export type AdminTab = "all" | "post" | "project" | "draft" | "scheduled" | "landing";
export type AdminSort = "updated" | "published";

export interface AdminContent {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImageUrl: string | null;
  altText: string | null;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  tags: string[];
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  projectStatus: ProjectStatus | null;
  featured: boolean;
  publishStatus: PublishStatus;
  publishedAt: string | null;
  readTime: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminContentOptions {
  tab?: AdminTab;
  q?: string;
  sort?: AdminSort;
  page?: number;
  pageSize?: number;
}

const ADMIN_SELECT =
  "id, type, title, slug, excerpt, body, cover_image_url, alt_text, category_id, tags, tech_stack, live_url, repo_url, project_status, featured, publish_status, published_at, read_time, created_at, updated_at, categories(id, name, slug)";

type AdminRow = {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  alt_text: string | null;
  category_id: string | null;
  tags: string[] | null;
  tech_stack: string[] | null;
  live_url: string | null;
  repo_url: string | null;
  project_status: ProjectStatus | null;
  featured: boolean;
  publish_status: PublishStatus;
  published_at: string | null;
  read_time: number | null;
  created_at: string;
  updated_at: string;
  categories: { id: string; name: string; slug: string } | null;
};

function mapAdminRow(row: AdminRow): AdminContent {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    coverImageUrl: row.cover_image_url,
    altText: row.alt_text,
    categoryId: row.category_id,
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

async function client(): Promise<SupabaseClient> {
  return createAuthClient();
}

export async function listAdminContent({
  tab = "all",
  q,
  sort = "updated",
  page = 1,
  pageSize = 20,
}: AdminContentOptions = {}): Promise<PagedResult<AdminContent>> {
  const empty = { items: [], total: 0, totalPages: 1, page };
  if (!isSupabaseConfigured()) {
    return demoListAdminContent({ tab, q, sort, page, pageSize });
  }

  let query = (await client())
    .from("content")
    .select(ADMIN_SELECT, { count: "exact" });

  if (tab === "post" || tab === "project") query = query.eq("type", tab);
  if (tab === "draft") query = query.eq("publish_status", "draft");
  if (tab === "scheduled") query = query.eq("publish_status", "scheduled");
  if (tab === "landing") query = query.eq("type", "project").eq("featured", true);
  if (q) query = query.ilike("title", `%${q.trim()}%`);

  query = query
    .order(sort === "published" ? "published_at" : "updated_at", {
      ascending: false,
      nullsFirst: false,
    })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query.returns<AdminRow[]>();
  if (error) {
    console.error("listAdminContent:", error.message);
    return empty;
  }

  const total = count ?? 0;
  return {
    items: (data ?? []).map(mapAdminRow),
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    page,
  };
}

export async function getAdminContentById(id: string): Promise<AdminContent | null> {
  if (!isSupabaseConfigured()) return demoContent().find((item) => item.id === id) ?? null;

  const { data, error } = await (await client())
    .from("content")
    .select(ADMIN_SELECT)
    .eq("id", id)
    .limit(1)
    .returns<AdminRow[]>();

  if (error || !data?.length) return null;
  return mapAdminRow(data[0]);
}

export interface AdminStats {
  posts: number;
  projects: number;
  drafts: number;
  subscribers: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  if (!isSupabaseConfigured()) {
    const items = demoContent();
    return {
      posts: items.filter((item) => item.type === "post").length,
      projects: items.filter((item) => item.type === "project").length,
      drafts: items.filter((item) => item.publishStatus === "draft").length,
      subscribers: DEMO_SUBSCRIBERS.length,
    };
  }

  const supabase = await client();
  const head = { count: "exact" as const, head: true };
  const [postsRes, projectsRes, draftsRes, subscribers] = await Promise.all([
    supabase.from("content").select("*", head).eq("type", "post"),
    supabase.from("content").select("*", head).eq("type", "project"),
    supabase.from("content").select("*", head).eq("publish_status", "draft"),
    subscriberCount(),
  ]);

  return {
    posts: postsRes.count ?? 0,
    projects: projectsRes.count ?? 0,
    drafts: draftsRes.count ?? 0,
    subscribers,
  };
}

async function subscriberCount(): Promise<number> {
  if (!isServiceConfigured()) return 0;
  const { count, error } = await createServiceClient()
    .from("subscribers")
    .select("*", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return demoContent().some((item) => item.slug === slug && item.id !== excludeId);
  }

  let query = (await client()).from("content").select("id").eq("slug", slug).limit(1);
  if (excludeId) query = query.neq("id", excludeId);
  const { data, error } = await query.returns<{ id: string }[]>();
  if (error) return false;
  return (data?.length ?? 0) > 0;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export async function listCategoriesWithCounts(): Promise<CategoryOption[]> {
  if (!isSupabaseConfigured()) {
    return fixtureCategories
      .map((category) => ({
        ...category,
        postCount: fixturePosts.filter((post) => post.category?.id === category.id).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const { data, error } = await (await client())
    .from("categories")
    .select("id, name, slug, content(count)")
    .order("name")
    .returns<
      { id: string; name: string; slug: string; content: { count: number }[] }[]
    >();

  if (error) {
    console.error("listCategoriesWithCounts:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    postCount: row.content?.[0]?.count ?? 0,
  }));
}

/** Distinct post tags — suggestions for the tag input. */
export async function listTagSuggestions(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return distinct(
      fixturePosts.map((post) => ({ values: post.tags })),
      "values",
    );
  }

  const { data, error } = await (await client())
    .from("content")
    .select("tags")
    .eq("type", "post")
    .not("tags", "is", null)
    .returns<{ tags: string[] }[]>();

  if (error) return [];
  return distinct(data ?? [], "tags");
}

/** Distinct project technologies — suggestions for the tech input. */
export async function listTechSuggestions(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return distinct(
      fixtureProjects.map((project) => ({ values: project.techStack })),
      "values",
    );
  }

  const { data, error } = await (await client())
    .from("content")
    .select("tech_stack")
    .eq("type", "project")
    .not("tech_stack", "is", null)
    .returns<{ tech_stack: string[] }[]>();

  if (error) return [];
  return distinct(
    (data ?? []).map((row) => ({ values: row.tech_stack })),
    "values",
  );
}

function distinct<T extends Record<string, string[]>>(rows: T[], key: keyof T): string[] {
  const values = new Set<string>();
  for (const row of rows) {
    for (const value of row[key] ?? []) values.add(value);
  }
  return [...values].sort((a, b) => a.localeCompare(b));
}

export async function listFactsAdmin(): Promise<Fact[]> {
  if (!isSupabaseConfigured()) return fixtureFacts;

  const { data, error } = await (await client())
    .from("facts")
    .select("id, icon, label, value, sort_order")
    .order("sort_order")
    .returns<{ id: string; icon: string; label: string; value: string; sort_order: number }[]>();

  if (error) return [];
  return (data ?? []).map((row) => ({
    id: row.id,
    icon: row.icon,
    label: row.label,
    value: row.value,
    order: row.sort_order,
  }));
}

export interface AdminSubscriber {
  id: string;
  email: string;
  createdAt: string;
}

export async function listSubscribers({
  q,
  page = 1,
  pageSize = 25,
}: { q?: string; page?: number; pageSize?: number } = {}): Promise<
  PagedResult<AdminSubscriber>
> {
  const empty = { items: [], total: 0, totalPages: 1, page };
  if (!isServiceConfigured()) {
    let items = DEMO_SUBSCRIBERS;
    if (q) {
      const needle = q.trim().toLowerCase();
      items = items.filter((subscriber) => subscriber.email.toLowerCase().includes(needle));
    }
    return paginate(
      [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      page,
      pageSize,
    );
  }

  let query = createServiceClient()
    .from("subscribers")
    .select("id, email, created_at", { count: "exact" });

  if (q) query = query.ilike("email", `%${q.trim()}%`);

  query = query
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  const { data, count, error } = await query.returns<
    { id: string; email: string; created_at: string }[]
  >();

  if (error) {
    console.error("listSubscribers:", error.message);
    return empty;
  }

  const total = count ?? 0;
  return {
    items: (data ?? []).map((row) => ({
      id: row.id,
      email: row.email,
      createdAt: row.created_at,
    })),
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    page,
  };
}

export async function listAllSubscribers(): Promise<AdminSubscriber[]> {
  if (!isServiceConfigured()) {
    return [...DEMO_SUBSCRIBERS].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const { data, error } = await createServiceClient()
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false })
    .returns<{ id: string; email: string; created_at: string }[]>();

  if (error) return [];
  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  }));
}

// ---------------------------------------------------------------------------
// Demo data — used only when Supabase is not configured.
//
// The admin then renders the built-in fixtures read-only, so every screen can
// be reviewed before a database exists. Writes are refused by `adminGuard`.
// ---------------------------------------------------------------------------

function paginate<T>(items: T[], page: number, pageSize: number): PagedResult<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    page,
  };
}

/** Fixture content as admin rows — drafts and scheduled items included. */
function toAdminContent(item: ContentItem): AdminContent {
  return {
    id: item.id,
    type: item.type,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    body: item.body,
    coverImageUrl: item.coverImageUrl,
    altText: null,
    categoryId: item.category?.id ?? null,
    category: item.category,
    tags: item.tags,
    techStack: item.techStack,
    liveUrl: item.liveUrl,
    repoUrl: item.repoUrl,
    projectStatus: item.projectStatus,
    featured: item.featured,
    publishStatus: item.publishStatus,
    publishedAt: item.publishedAt,
    readTime: item.readTime,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function demoContent(): AdminContent[] {
  return applyFeaturedOverrides([...fixturePosts, ...fixtureProjects]).map(toAdminContent);
}

function demoListAdminContent({
  tab = "all",
  q,
  sort = "updated",
  page = 1,
  pageSize = 20,
}: AdminContentOptions): PagedResult<AdminContent> {
  let items = demoContent();

  if (tab === "post" || tab === "project") items = items.filter((item) => item.type === tab);
  if (tab === "draft") items = items.filter((item) => item.publishStatus === "draft");
  if (tab === "scheduled") items = items.filter((item) => item.publishStatus === "scheduled");
  if (tab === "landing") items = items.filter((item) => item.type === "project" && item.featured);
  if (q) {
    const needle = q.trim().toLowerCase();
    items = items.filter((item) => item.title.toLowerCase().includes(needle));
  }

  const key = sort === "published" ? "publishedAt" : "updatedAt";
  items = [...items].sort((a, b) => (b[key] ?? "").localeCompare(a[key] ?? ""));

  return paginate(items, page, pageSize);
}

/** Stand-in newsletter list so the Subscribers screen has something to show. */
const DEMO_SUBSCRIBERS: AdminSubscriber[] = [
  { id: "sub-1", email: "ada.okafor@example.com", createdAt: "2026-09-28T09:00:00.000Z" },
  { id: "sub-2", email: "marco.silva@example.com", createdAt: "2026-09-21T09:00:00.000Z" },
  { id: "sub-3", email: "john.doe@example.com", createdAt: "2026-09-14T09:00:00.000Z" },
  { id: "sub-4", email: "northwind.team@example.com", createdAt: "2026-09-02T09:00:00.000Z" },
];
