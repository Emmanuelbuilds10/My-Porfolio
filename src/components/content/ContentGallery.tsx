import { CoverImage } from "@/components/ui/CoverImage";
import type { ContentImage } from "@/lib/types";

interface ContentGalleryProps {
  images: ContentImage[];
  /** Falls back to "<title> — image N" when a tile has no alt text. */
  title: string;
}

/**
 * The extra images attached to a post or project, laid out under the body.
 *
 * Renders nothing when the gallery is empty, so pages whose content has no
 * extra imagery are byte-for-byte what they were. Every tile goes through
 * `CoverImage`, which gives it the same fixed ratio, rounded mask, hover zoom
 * and missing-image fallback as the covers elsewhere on the site.
 */
export function ContentGallery({ images, title }: ContentGalleryProps) {
  if (images.length === 0) return null;

  return (
    <ul className="grid gap-card sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <li key={`${image.url}-${index}`}>
          <CoverImage
            src={image.url}
            alt={image.alt || `${title} — image ${index + 1}`}
            ratio="card"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </li>
      ))}
    </ul>
  );
}
