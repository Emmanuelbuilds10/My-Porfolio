import Link from "next/link";
import { CoverImage } from "@/components/ui/CoverImage";
import { TagPill } from "@/components/ui/TagPill";
import { formatCardDate } from "@/lib/format";
import type { ContentItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: ContentItem;
  /** Set on the first row of a grid so the covers load eagerly. */
  priority?: boolean;
  className?: string;
}

/**
 * Grid card on the Home and Writing pages.
 *
 * The title carries the only link, stretched over the whole card with an
 * overlay so the card is clickable without nesting interactive elements.
 * Add `group` is not needed — the article owns it for the hover states.
 */
export function PostCard({ post, priority = false, className }: PostCardProps) {
  const href = `/writing/${post.slug}`;

  return (
    <article
      className={cn(
        "group relative flex flex-col",
        "transition-transform duration-300 ease-out-soft",
        "hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <CoverImage
        src={post.coverImageUrl}
        alt={`Cover for “${post.title}”`}
        ratio="card"
        priority={priority}
      />

      <div className="mt-4 flex items-center gap-3">
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

      <h3 className="mt-3 font-serif text-[17px] leading-snug text-fg transition-colors duration-200 group-hover:text-accent">
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
        {post.excerpt}
      </p>
    </article>
  );
}
