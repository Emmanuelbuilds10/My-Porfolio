import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CoverImage } from "@/components/ui/CoverImage";
import { Container } from "@/components/ui/Container";
import { TagPill } from "@/components/ui/TagPill";
import { ContentGallery } from "@/components/content/ContentGallery";
import { Markdown } from "@/components/content/Markdown";
import { StatusBadge } from "@/components/admin/Badges";
import { StatusPill } from "@/components/content/StatusPill";
import { getAdminContentById } from "@/lib/admin/data";
import { formatPostMeta } from "@/lib/format";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

/**
 * Draft preview. Reads through the authenticated client so drafts (invisible
 * to the public route) render exactly as they will once published.
 */
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getAdminContentById(id);
  if (!item) notFound();

  return (
    <div className="pb-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-card border border-warn/40 bg-warn/10 px-5 py-3">
        <p className="text-sm text-fg">
          Draft preview — this is not live on the public site.
        </p>
        <div className="flex items-center gap-3">
          <StatusBadge status={item.publishStatus} />
          <Link
            href={`/admin/${item.id}/edit`}
            className="text-sm text-muted transition-colors hover:text-accent-text"
          >
            Edit
          </Link>
        </div>
      </div>

      <Container>
        <div className="max-w-[760px]">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent-text"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Back to content
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {item.type === "post" ? (
              <>
                {item.publishedAt ? (
                  <time className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
                    {formatPostMeta(item.publishedAt, item.readTime)}
                  </time>
                ) : null}
                {item.category ? <TagPill>{item.category.name}</TagPill> : null}
              </>
            ) : item.projectStatus ? (
              <StatusPill status={item.projectStatus} />
            ) : null}
          </div>

          <h1 className="mt-5 font-serif text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1] text-fg">
            {item.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">{item.excerpt}</p>
        </div>
      </Container>

      <Container className="mt-10">
        <CoverImage
          src={item.coverImageUrl}
          alt={item.altText ?? `Cover for “${item.title}”`}
          ratio="cover"
          priority
          sizes="(min-width: 1240px) 1240px, 100vw"
        />
      </Container>

      {item.techStack.length > 0 ? (
        <Container className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              Built with
            </span>
            <ul className="flex flex-wrap gap-2">
              {item.techStack.map((tech) => (
                <li key={tech}>
                  <TagPill>{tech}</TagPill>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      ) : null}

      <Container size="prose" className="mt-12">
        <Markdown content={item.body} />
      </Container>

      {item.gallery.length > 0 ? (
        <Container className="mt-12">
          <ContentGallery images={item.gallery} title={item.title} />
        </Container>
      ) : null}
    </div>
  );
}
