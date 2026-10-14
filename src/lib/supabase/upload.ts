import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;
/** The single public bucket; folders keep covers, galleries and avatars apart. */
const BUCKET = "covers";

export type UploadResult = { ok: true; url: string } | { ok: false; message: string };

/**
 * Upload one image to the public `covers` bucket using the signed-in admin's
 * session (the bucket's RLS policies require `is_admin()`), so no service key is
 * ever involved. Shared by the single-image field and the gallery so both
 * enforce the same type/size limits and land in the same kind of folder.
 *
 * Never throws: validation and network failures come back as `ok: false` so the
 * caller can show the message inline.
 */
export async function uploadImage(file: File, folder: string): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    return { ok: false, message: "Only image files are allowed." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "Images must be 5MB or smaller." };
  }

  try {
    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });

    if (error) return { ok: false, message: error.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return { ok: true, url: data.publicUrl };
  } catch (caught) {
    return {
      ok: false,
      message: caught instanceof Error ? caught.message : "Upload failed.",
    };
  }
}
