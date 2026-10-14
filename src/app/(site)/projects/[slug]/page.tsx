import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { CoverImage } from "@/components/ui/CoverImage";
import { TagPill } from "@/components/ui/TagPill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ContentGallery } from "@/components/content/ContentGallery";
import { Markdown } from "@/components/content/Markdown";
import { ProjectCard } from "@/components/content/ProjectCard";
import { StatusPill } from "@/components/content/StatusPill";
import { AuthorCard } from "@/components/content/AuthorCard";
import { ContactOnXButton, CopyLinkButton } from "@/components/content/DetailActions";
import { GithubIcon } from "@/components/icons";
import {
  getProjectBySlug,
  getPublishedProjectSlugs,
  getRelatedProjects,
  getSiteSettings,
} from "@/lib/queries";
import { site, xContactUrl } from "@/lib/site";

/** ISR: a published project re-renders at most once a minute. */
export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

/** Dedupe the lookup shared by `generateMetadata` and the page render. */
const getProject = cache(getProjectBySlug);

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project not found", robots: { index: false, follow: false } };
  }

  const path = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: project.title,
      description: project.excerpt,
      url: path,
      images: project.coverImageUrl
        ? [{ url: project.coverImageUrl, alt: project.title }]
        : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const [related, settings] = await Promise.all([
    getRelatedProjects(project.id, 3),
    getSiteSettings(),
  ]);
  const twitterUrl = settings ? settings.twitterUrl : site.twitterUrl;
  const contactHref = xContactUrl(twitterUrl);

  return (
    <article className="pb-section">
      <Container>
        <div className="max-w-[760px] pt-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-accent-text"
          >
            <ArrowLeft aria-hidden className="size-4" />
            All projects
          </Link>

          {project.projectStatus ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StatusPill status={project.projectStatus} />
            </div>
          ) : null}

          <h1 className="mt-5 font-serif text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1] text-fg">
            {project.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted">{project.excerpt}</p>

          {project.liveUrl || project.repoUrl ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {project.liveUrl ? (
                <ButtonLink href={project.liveUrl}>
                  <ExternalLink aria-hidden className="size-4" />
                  Live site
                </ButtonLink>
              ) : null}
              {project.repoUrl ? (
                <ButtonLink href={project.repoUrl} variant="secondary">
                  <GithubIcon className="size-4" />
                  Source code
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>

      <Container className="mt-10">
        <CoverImage
          src={project.coverImageUrl}
          alt={`Cover for “${project.title}”`}
          ratio="cover"
          priority
          sizes="(min-width: 1240px) 1240px, 100vw"
        />
      </Container>

      {project.techStack.length > 0 ? (
        <Container className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              Built with
            </span>
            <ul className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <li key={tech}>
                  <TagPill>{tech}</TagPill>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      ) : null}

      <Container size="prose" className="mt-12">
        <Markdown content={project.body} />
      </Container>

      {project.gallery.length > 0 ? (
        <Container className="mt-12">
          <ContentGallery images={project.gallery} title={project.title} />
        </Container>
      ) : null}

      <Container size="prose" className="mt-section">
        <AuthorCard
          name={settings?.name ?? site.name}
          role={settings?.role ?? site.role}
          avatarUrl={settings?.avatarUrl ?? null}
        >
          <ContactOnXButton href={contactHref} />
          <CopyLinkButton />
        </AuthorCard>
      </Container>

      {related.length > 0 ? (
        <Container className="mt-section">
          <SectionHeading title="More projects" />
          <div className="mt-8 grid gap-card sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <ProjectCard key={item.id} project={item} priority={index === 0} />
            ))}
          </div>
        </Container>
      ) : null}
    </article>
  );
}
