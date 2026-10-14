import { z } from "zod";
import { RESERVED_SLUGS } from "@/lib/validation";

/**
 * Validation for every admin write. Server Actions parse input with these and
 * the same messages are surfaced per field in the editor.
 */

export const contentTypeSchema = z.enum(["post", "project"]);
export const publishStatusSchema = z.enum(["draft", "published", "scheduled"]);
export const projectStatusSchema = z.enum(["live", "in-progress", "archived"]);

const httpUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^https?:\/\/\S+$/i.test(value),
    "Enter a full URL starting with http:// or https://.",
  );

const slug = z
  .string()
  .trim()
  .min(1, "A slug is required.")
  .max(80, "Keep the slug under 80 characters.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.")
  .refine((value) => !RESERVED_SLUGS.has(value), "That slug is reserved by the app.");

const tag = z.string().trim().min(1).max(40);

/**
 * One extra image. Unlike `coverImageUrl` the URL is required — an empty entry
 * would render as a broken tile — while `alt` stays optional (decorative art).
 */
const galleryImage = z.object({
  url: z
    .string()
    .trim()
    .refine(
      (value) => /^https?:\/\/\S+$/i.test(value),
      "Enter a full image URL starting with http:// or https://.",
    ),
  alt: z.string().trim().max(200).default(""),
});

export const contentSchema = z.object({
  id: z.uuid().optional(),
  type: contentTypeSchema.default("post"),
  title: z.string().trim().min(1, "A title is required.").max(160, "Keep the title under 160 characters."),
  slug,
  excerpt: z.string().trim().max(320, "Keep the short description under 320 characters.").default(""),
  body: z.string().max(200_000).default(""),
  coverImageUrl: httpUrl.default(""),
  gallery: z.array(galleryImage).max(12, "Keep the gallery to 12 images or fewer.").default([]),
  altText: z.string().trim().max(200).default(""),
  featured: z.boolean().default(false),
  categoryId: z.uuid().nullable().default(null),
  tags: z.array(tag).max(20, "That's a lot of tags.").default([]),
  techStack: z.array(tag).max(20, "That's a lot of technologies.").default([]),
  liveUrl: httpUrl.default(""),
  repoUrl: httpUrl.default(""),
  projectStatus: projectStatusSchema.nullable().default(null),
  publishStatus: publishStatusSchema.default("draft"),
  publishedAt: z.string().trim().nullable().default(null),
});

export type ContentValues = z.input<typeof contentSchema>;

export const categorySchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(1, "A name is required.").max(60, "Keep the name under 60 characters."),
});

export const factSchema = z.object({
  id: z.uuid().optional(),
  icon: z.string().trim().min(1, "Pick an icon.").max(40),
  label: z.string().trim().min(1, "A label is required.").max(40),
  value: z.string().trim().min(1, "A value is required.").max(120),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const settingsSchema = z.object({
  name: z.string().trim().min(1, "A name is required.").max(80),
  role: z.string().trim().min(1, "A role is required.").max(120),
  location: z.string().trim().max(120).default(""),
  email: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value),
      "Enter a valid email address.",
    )
    .default(""),
  bio: z.string().max(20_000).default(""),
  avatarUrl: httpUrl.default(""),
  twitterUrl: httpUrl.default(""),
  githubUrl: httpUrl.default(""),
  dribbbleUrl: httpUrl.default(""),
  linkedinUrl: httpUrl.default(""),
});

export const signInSchema = z.object({
  email: z.string().trim().min(1, "Enter your email."),
  password: z.string().min(1, "Enter your password."),
});

/** The failure variant, with per-field messages for inline display. */
export type Failure = {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string>;
};

/** Result shape for admin writes that may create a row (returns its id). */
export type SaveResult =
  | { ok: true; message: string; id?: string }
  | Failure;

/** Result shape for the CSV export action. */
export type ExportResult =
  | { ok: true; message: string; csv?: string; filename?: string }
  | Failure;

/** Zod issues -> `{ field: message }` for inline display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const flat = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const output: Record<string, string> = {};
  for (const [key, messages] of Object.entries(flat)) {
    if (messages?.[0]) output[key] = messages[0];
  }
  return output;
}

/** Standard failure result for an invalid submission. */
export function invalid(error: z.ZodError): Failure {
  const errors = fieldErrors(error);
  const first = Object.values(errors)[0];
  return {
    ok: false,
    message: first ?? "Please fix the highlighted fields.",
    fieldErrors: errors,
  };
}
