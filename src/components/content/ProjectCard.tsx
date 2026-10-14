import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { CoverImage } from "@/components/ui/CoverImage";
import { TagPill } from "@/components/ui/TagPill";
import { StatusPill } from "@/components/content/StatusPill";
import type { ContentItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Tech pills shown on a card before collapsing the rest into "+N". */
const MAX_TECH = 3;

interface ProjectCardProps {
  project: ContentItem;
  priority?: boolean;
  className?: string;
}

/**
 * Projects index card — same skeleton as `PostCard`, with the status pill, the
 * capped tech stack and the external links added.
 */
export function ProjectCard({ project, priority = false, className }: ProjectCardProps) {
  const href = `/projects/${project.slug}`;
  const shownTech = project.techStack.slice(0, MAX_TECH);
  const extraTech = project.techStack.length - shownTech.length;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col",
        "transition-transform duration-300 ease-out-soft",
        "hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <CoverImage
        src={project.coverImageUrl}
        alt={`Cover for “${project.title}”`}
        ratio="card"
        priority={priority}
      />

      {project.projectStatus ? (
        <div className="mt-4 flex items-center gap-3">
          <StatusPill status={project.projectStatus} />
        </div>
      ) : null}

      <h3 className="mt-3 font-serif text-[17px] leading-snug text-fg transition-colors duration-200 group-hover:text-accent-text">
        <Link href={href} className="after:absolute after:inset-0 after:content-['']">
          {project.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
        {project.excerpt}
      </p>

      {shownTech.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {shownTech.map((tech) => (
            <li key={tech}>
              <TagPill>{tech}</TagPill>
            </li>
          ))}
          {extraTech > 0 ? (
            <li>
              <TagPill className="bg-accent-soft text-accent-text">+{extraTech}</TagPill>
            </li>
          ) : null}
        </ul>
      ) : null}

      {project.liveUrl || project.repoUrl ? (
        <div className="relative z-10 mt-5 flex items-center gap-5">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-accent-text"
            >
              <ExternalLink aria-hidden className="size-3.5" />
              Live
            </a>
          ) : null}
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-accent-text"
            >
              <GithubIcon className="size-3.5" />
              GitHub
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
