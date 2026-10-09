"use server";

import { revalidatePath } from "next/cache";
import { adminGuard } from "@/lib/admin/guard";
import { invalid, settingsSchema, type SaveResult } from "@/lib/admin/schemas";
import { createAuthClient } from "@/lib/supabase/server";

export interface SettingsValues {
  name: string;
  role: string;
  location: string;
  email: string;
  bio: string;
  avatarUrl: string;
  twitterUrl: string;
  githubUrl: string;
  behanceUrl: string;
  linkedinUrl: string;
}

/** Upsert the single `site_settings` row (id = 1). */
export async function saveSettings(values: SettingsValues): Promise<SaveResult> {
  const denied = await adminGuard();
  if (denied) return denied;

  const parsed = settingsSchema.safeParse(values);
  if (!parsed.success) {
    const result = invalid(parsed.error);
    return { ok: false, message: result.message, fieldErrors: result.fieldErrors };
  }

  const data = parsed.data;

  const { error } = await (await createAuthClient()).from("site_settings").upsert(
    {
      id: 1,
      name: data.name,
      role: data.role,
      location: data.location || null,
      email: data.email,
      bio: data.bio,
      avatar_url: data.avatarUrl || null,
      twitter_url: data.twitterUrl || null,
      github_url: data.githubUrl || null,
      behance_url: data.behanceUrl || null,
      linkedin_url: data.linkedinUrl || null,
    },
    { onConflict: "id" },
  );

  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin");

  return { ok: true, message: "Settings saved." };
}
