import { categories, facts, posts, projects, siteSettings } from "@/content/fixtures";
import { applyFeaturedOverrides } from "@/lib/demo-featured";
import type {
  CategoryWithCount,
  GetPostsOptions,
  GetProjectsOptions,
  PagedResult,
  TechFilter,
} from "@/lib/queries";
import type { ContentItem, Fact, SiteSettings } from "@/lib/types";

/**
 * Demo data source.
 *
 * When Supabase is not configured the app runs against the built-in fixtures
 * (`src/content/fixtures.ts`) instead of returning empty lists, so the whole
 * site — landing page, Writing, Projects, About — looks identical before and
 * after the database is connected. This mirrors the fixtures' own contract.
 *
 * Every function here is a pure in-memory equivalent of the matching query in
 * `queries.ts`, including the public-visibility rule (published, or scheduled
 * once its date has passed). Nothing here is used once Supabase is configured.
 */

/** The visibility rule RLS enforces in the database, applied to fixtures. */
function isPublic(item: ContentItem): boolean {
  if (item.publishStatus === "published") return true;
  if (item.publishStatus !== "scheduled" || !item.publishedAt) return false;
  return new Date(item.publishedAt).getTime() <= Date.now();
}

/** Newest first, then by title for a stable order when dates tie. */
function byPublishedDesc(a: ContentItem, b: ContentItem): number {
  return (
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") ||
    a.title.localeCompare(b.title)
  );
}

function matches(item: ContentItem, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    item.title.toLowerCase().includes(needle) ||
    item.excerpt.toLowerCase().includes(needle)
  );
}

function paginate<T>(items: T[], page: number, pageSize: number): PagedResult<T> {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    page,
  };
}

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

function publicPosts(): ContentItem[] {
  return applyFeaturedOverrides(
    posts.filter((post) => post.type === "post" && isPublic(post)),
  );
}

export function demoGetFeaturedPost(): ContentItem | null {
  return publicPosts().filter((post) => post.featured).sort(byPublishedDesc)[0] ?? null;
}

export function demoGetLatestPosts(limit = 6): ContentItem[] {
  return publicPosts().sort(byPublishedDesc).slice(0, limit);
}

export function demoGetPosts({
  category,
  q,
  page = 1,
  pageSize = 9,
}: GetPostsOptions = {}): PagedResult<ContentItem> {
  let items = publicPosts();
  if (category) items = items.filter((post) => post.category?.slug === category);
  if (q) items = items.filter((post) => matches(post, q));
  return paginate(items.sort(byPublishedDesc), page, pageSize);
}

export function demoGetPostBySlug(slug: string): ContentItem | null {
  return publicPosts().find((post) => post.slug === slug) ?? null;
}

export function demoGetRelatedPosts(
  postId: string,
  categoryId: string | null,
  limit = 3,
): ContentItem[] {
  const pool = publicPosts()
    .filter((post) => post.id !== postId)
    .sort(byPublishedDesc);

  const ranked = categoryId
    ? [...pool].sort(
        (a, b) =>
          Number(b.category?.id === categoryId) - Number(a.category?.id === categoryId),
      )
    : pool;

  return ranked.slice(0, limit);
}

export function demoGetCategories(): CategoryWithCount[] {
  const visible = publicPosts();
  return categories
    .map((category) => ({
      ...category,
      postCount: visible.filter((post) => post.category?.id === category.id).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

function publicProjects(): ContentItem[] {
  return applyFeaturedOverrides(
    projects.filter((project) => project.type === "project" && isPublic(project)),
  );
}

export function demoGetProjects({
  tech,
  status,
  q,
  page = 1,
  pageSize = 9,
}: GetProjectsOptions = {}): PagedResult<ContentItem> {
  let items = publicProjects();
  if (tech) items = items.filter((project) => project.techStack.includes(tech));
  if (status) items = items.filter((project) => project.projectStatus === status);
  if (q) items = items.filter((project) => matches(project, q));
  return paginate(items.sort(byPublishedDesc), page, pageSize);
}

export function demoGetProjectBySlug(slug: string): ContentItem | null {
  return publicProjects().find((project) => project.slug === slug) ?? null;
}

export function demoGetFeaturedProjects(limit = 2): ContentItem[] {
  return publicProjects()
    .filter((project) => project.featured)
    .sort(byPublishedDesc)
    .slice(0, limit);
}

export function demoGetTechFilters(): TechFilter[] {
  const counts = new Map<string, number>();
  for (const project of publicProjects()) {
    for (const tech of project.techStack) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => b.count - a.count || a.tech.localeCompare(b.tech));
}

export function demoGetRelatedProjects(projectId: string, limit = 3): ContentItem[] {
  const current = publicProjects().find((project) => project.id === projectId);
  return publicProjects()
    .filter((project) => project.id !== projectId)
    .map((project) => ({
      project,
      overlap: project.techStack.filter((tech) =>
        (current?.techStack ?? []).includes(tech),
      ).length,
    }))
    .sort((a, b) => b.overlap - a.overlap || byPublishedDesc(a.project, b.project))
    .slice(0, limit)
    .map(({ project }) => project);
}

export function demoGetPublishedPostSlugs(): string[] {
  return publicPosts().map((post) => post.slug);
}

export function demoGetPublishedProjectSlugs(): string[] {
  return publicProjects().map((project) => project.slug);
}

// ---------------------------------------------------------------------------
// Shared content
// ---------------------------------------------------------------------------

export function demoGetSiteSettings(): SiteSettings | null {
  return siteSettings;
}

export function demoGetFacts(): Fact[] {
  return facts;
}
