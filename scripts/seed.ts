import { createScriptClient } from "../src/lib/supabase/script";
import { ADMIN_EMAIL, ADMIN_PASSWORD, seedCategories, seedFacts, seedSettings } from "./seed/data";
import { seedLandingImages } from "./seed/landing";
import { seedPosts } from "./seed/posts";
import { seedProjects } from "./seed/projects";

async function main() {
  const supabase = createScriptClient();

  // ------------------------------------------------------------------ admin
  // The admin user must exist for Phase 4 login and for RLS's is_admin().
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const admin = existingUsers?.users?.find(
    (user) => user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase(),
  );

  if (admin) {
    console.log(`admin user exists: ${ADMIN_EMAIL}`);
  } else {
    const { error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) throw new Error(`create admin: ${error.message}`);
    console.log(`created admin user: ${ADMIN_EMAIL}`);
  }

  // ------------------------------------------------------ admin email setting
  const { error: settingsKeyError } = await supabase
    .from("app_settings")
    .upsert({ key: "admin_email", value: ADMIN_EMAIL }, { onConflict: "key" });
  if (settingsKeyError) throw new Error(`app_settings: ${settingsKeyError.message}`);

  // -------------------------------------------------------------- categories
  const { data: existingCategories } = await supabase.from("categories").select("id, slug");
  const categoryIds = new Map<string, string>();
  for (const category of seedCategories) {
    const existing = existingCategories?.find((row) => row.slug === category.slug);
    if (existing) {
      categoryIds.set(category.slug, existing.id);
      continue;
    }
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: category.name, slug: category.slug })
      .select("id, slug")
      .single();
    if (error) throw new Error(`category ${category.slug}: ${error.message}`);
    categoryIds.set(category.slug, data.id);
  }
  console.log(`categories ready: ${categoryIds.size}`);

  // ----------------------------------------------------------------- content
  // Upsert by slug so seed edits update rows instead of duplicating them.
  const rows = [...seedPosts, ...seedProjects].map((item) => ({
    type: item.type,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    body: item.body,
    cover_image_url: item.cover_image_url,
    category_id:
      item.type === "post"
        ? (categoryIds.get((item as (typeof seedPosts)[number]).category_slug) ?? null)
        : null,
    tags: item.type === "post" ? (item as (typeof seedPosts)[number]).tags : [],
    tech_stack:
      item.type === "project" ? (item as (typeof seedProjects)[number]).tech_stack : [],
    live_url: item.type === "project" ? (item as (typeof seedProjects)[number]).live_url : null,
    repo_url: item.type === "project" ? (item as (typeof seedProjects)[number]).repo_url : null,
    project_status:
      item.type === "project"
        ? (item as (typeof seedProjects)[number]).project_status
        : null,
    featured: item.featured ?? false,
    // `published` + past dates keeps everything visible immediately after seeding.
    publish_status: "published" as const,
    published_at: item.published_at,
  }));

  const { error: contentError } = await supabase.from("content").upsert(rows, { onConflict: "slug" });
  if (contentError) throw new Error(`content: ${contentError.message}`);
  console.log(`content upserted: ${rows.length} rows`);

  // -------------------------------------------------------------------- facts
  const { error: factsError } = await supabase
    .from("facts")
    .upsert(seedFacts, { onConflict: "label" });
  if (factsError) throw new Error(`facts: ${factsError.message}`);
  console.log(`facts upserted: ${seedFacts.length}`);

  // ------------------------------------------------------------ site settings
  const { error: settingsError } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...seedSettings }, { onConflict: "id" });
  if (settingsError) throw new Error(`site_settings: ${settingsError.message}`);
  console.log("site_settings upserted");

  // ------------------------------------------------------- landing carousel
  // Default tiles reuse the project covers; the admin edits them afterwards.
  const { error: marqueeError } = await supabase
    .from("landing_images")
    .upsert(
      seedLandingImages.map((image) => ({
        image_url: `/images/covers/${image.slug}.jpg`,
        alt: image.alt,
        sort_order: image.sort_order,
      })),
    );
  if (marqueeError) throw new Error(`landing_images: ${marqueeError.message}`);
  console.log(`landing_images upserted: ${seedLandingImages.length}`);

  console.log("\nSeed complete. Admin login: change the password before going live.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
