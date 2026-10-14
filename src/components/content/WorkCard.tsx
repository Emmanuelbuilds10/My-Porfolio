import { Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { CoverImage } from "@/components/ui/CoverImage";
import type { ContentItem } from "@/lib/types";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface WorkCardProps {
  project: ContentItem;
  priority?: boolean;
}

/**
 * One tile in the landing page's "Selected Work" grid: the artwork with a
 * full-width case-study button tucked under its bottom edge.
 *
 * The button links to the internal project page rather than an external
 * portfolio site, so the whole flow stays on-site.
 */
export function WorkCard({ project, priority = false }: WorkCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col",
        "transition-transform duration-300 ease-out-soft",
        "hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <CoverImage
        src={project.coverImageUrl}
        alt={`Cover for “${project.title}”`}
        ratio="card"
        priority={priority}
        className="rounded-card ring-1 ring-line"
      />
      <div className="relative z-10 -mt-5 flex justify-center px-6">
        <ButtonLink href={`/projects/${project.slug}`} size="md" className="w-full">
          <Play aria-hidden className="size-3.5 fill-current" />
          {site.caseStudyLabel}
        </ButtonLink>
      </div>
      <h3 className="mt-4 text-center font-serif text-[17px] leading-snug text-fg transition-colors duration-200 group-hover:text-accent-text">
        {project.title}
      </h3>
    </article>
  );
}
