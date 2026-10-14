import Link from "next/link";
import { CoverImage } from "@/components/ui/CoverImage";
import { TagPill } from "@/components/ui/TagPill";
import { formatCardDate } from "@/lib/format";
import type { ContentItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FeaturedPostProps {
  post: ContentItem;
  className?: string;
}

/**
 * The single promoted post leading the archive: artwork left, copy right.
 *
 * The title is an `h3` because the "Featured Post" label above it is the `h2`
 * for this band — keeping the page's heading order h1 → h2 → h3.
 */
export function FeaturedPost({ post, className }: FeaturedPostProps) {
  const href = `/writing/${post.slug}`;

  return (
    <article
      className={cn("group relative grid items-center gap-8 md:grid-cols-2 md:gap-14", className)}
    >
      <CoverImage
        src={post.coverImageUrl}
        alt={`Cover for “${post.title}”`}
        ratio="featured"
        priority
        sizes="(min-width: 768px) 46vw, 100vw"
      />

      <div>
        <div className="flex items-center gap-3">
          {post.publishedAt ? (
            <time
              dateTime={post.publishedAt}
              className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase"
            >
              {formatCardDate(post.publishedAt)}
            </time>
          ) : null}
          {post.category ? <TagPill>{post.category.name}</TagPill> : null}
        </div>

        <h3 className="mt-4 font-serif text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.15] text-fg transition-colors duration-200 group-hover:text-accent-text">
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
