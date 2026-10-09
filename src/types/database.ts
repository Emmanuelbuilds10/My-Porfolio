export type ContentType = "post" | "project";
export type PublishStatus = "draft" | "published" | "scheduled";
export type ProjectStatus = "live" | "in-progress" | "archived";

/**
 * Row shapes mirroring the Postgres schema. The seed and queries map the
 * snake_case columns onto these camelCase domain types once, at the edge.
 */
export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface ContentRow {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[];
  tech_stack: string[];
  live_url: string | null;
  repo_url: string | null;
  project_status: ProjectStatus | null;
  featured: boolean;
  publish_status: PublishStatus;
  published_at: string | null;
  read_time: number | null;
  blur_data_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FactRow {
  id: string;
  icon: string;
  label: string;
  value: string;
  sort_order: number;
}

export interface SiteSettingsRow {
  id: number;
  name: string;
  role: string;
  location: string | null;
  email: string;
  bio: string;
  avatar_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  behance_url: string | null;
  linkedin_url: string | null;
  updated_at: string;
}

export interface SubscriberRow {
  id: string;
  email: string;
  created_at: string;
}
