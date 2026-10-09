/**
 * Domain types. These mirror the database 1:1 (see `supabase/schema.sql` in
 * Phase 2) so the same shapes flow from Postgres to Server Components to props
 * without translation layers.
 */

export type ContentType = "post" | "project";

/** Editorial state. `scheduled` publishes itself once `publishedAt` passes. */
export type PublishStatus = "draft" | "published" | "scheduled";

/** Only relevant when `type === "project"`. */
export type ProjectStatus = "live" | "in-progress" | "archived";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

/**
 * One row of the `content` table. Posts and projects share the table and every
 * shared column — the type-specific columns are simply null for the other type.
 */
export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  /** Markdown. */
  body: string;
  coverImageUrl: string | null;

  /** Posts only. */
  category: Category | null;
  tags: string[];

  /** Projects only. */
  techStack: string[];
  liveUrl: string | null;
  repoUrl: string | null;
  projectStatus: ProjectStatus | null;

  featured: boolean;
  publishStatus: PublishStatus;
  publishedAt: string | null;
  /** Minutes, recalculated from `body` on every write. */
  readTime: number | null;

  createdAt: string;
  updatedAt: string;
}

/** A card in the About page's "A few facts" grid. Admin-editable. */
export interface Fact {
  id: string;
  /** Key into `factIcons` — see `components/content/FactCard.tsx`. */
  icon: string;
  label: string;
  value: string;
  order: number;
}

/** Single-row table holding the About page copy and the social links. */
export interface SiteSettings {
  name: string;
  role: string;
  /** Where the author is based; shown on the About page. */
  location: string | null;
  /** One string per paragraph of the bio (bio is stored as markdown). */
  bioParagraphs: string[];
  avatarUrl: string | null;
  email: string;
  twitterUrl: string;
  githubUrl: string;
  behanceUrl: string;
  linkedinUrl: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}

/** One contact-form submission, read through the admin inbox. */
export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/** One tile of the landing page's "Selected Work" cover carousel. */
export interface LandingImage {
  id: string;
  imageUrl: string;
  alt: string;
  order: number;
}

/** Result shape returned by every Server Action, rendered inline or as a toast. */
export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };
