import { revalidatePath } from "next/cache";
import type { ContentType } from "@/lib/types";

/** Revalidate every public surface a content change can touch. */
export function revalidateContent(
  type: ContentType,
  slug: string,
  previousSlug?: string,
) {
  revalidatePath("/");
  revalidatePath("/admin");

  if (type === "post") {
    revalidatePath("/writing");
    revalidatePath(`/writing/${slug}`);
    if (previousSlug && previousSlug !== slug) revalidatePath(`/writing/${previousSlug}`);
    return;
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/projects/${previousSlug}`);
}

export function revalidateAbout() {
  revalidatePath("/about");
  revalidatePath("/admin");
}
