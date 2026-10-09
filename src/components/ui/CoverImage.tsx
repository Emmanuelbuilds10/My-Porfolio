"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const RATIOS = {
  /** Post/project cards in the 3-column grids. */
  card: "aspect-[6/5]",
  /** The single featured post on the home page. */
  featured: "aspect-[5/4]",
  /** Full-width cover on a detail page. */
  cover: "aspect-[16/9]",
  square: "aspect-square",
} as const;

export type CoverRatio = keyof typeof RATIOS;

interface CoverImageProps {
  src?: string | null;
  alt: string;
  ratio?: CoverRatio;
  /** Responsive `sizes` hint — pass the real grid widths to keep images small. */
  sizes?: string;
  /** Only for the hero and above-the-fold covers. */
  priority?: boolean;
  className?: string;
}

/**
 * Every image on the site goes through here.
 *
 * - Consistent aspect ratios so grids never reflow while loading.
 * - Rounded mask + hover zoom (put `group` on the card wrapper).
 * - Falls back to a violet-washed placeholder when no cover exists yet, so the
 *   layout is complete before the artwork lands.
 *
 * Blur placeholders are attached in Phase 5, where the upload pipeline can
 * generate a real LQIP per image.
 */
export function CoverImage({
  src,
  alt,
  ratio = "card",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className,
}: CoverImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative isolate w-full overflow-hidden rounded-media bg-well",
        RATIOS[ratio],
        className,
      )}
    >
      {!src || failed ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 bg-[radial-gradient(120%_100%_at_15%_0%,var(--color-accent-soft),transparent_65%)]"
        >
          <Lock
            aria-hidden
            className="absolute right-4 bottom-4 size-4 text-muted/50"
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={cn(
            "object-cover",
            "transition-transform duration-700 ease-out-soft",
            "group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          )}
        />
      )}
    </div>
  );
}
