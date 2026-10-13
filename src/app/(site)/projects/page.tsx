import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { SearchInput } from "@/components/ui/SearchInput";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/content/ProjectCard";
import { HERO_IMAGE } from "@/lib/hero-image";
import { buildQueryHref, firstParam, PAGE_SIZE, parsePage } from "@/lib/pagination";
import { getProjects, getTechFilters } from "@/lib/queries";
import { site } from "@/lib/site";
import type { ProjectStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description: site.projectsHeroSubtitle,
  alternates: { canonical: "/projects" },
};

/** Status chips offered on the index — "archived" stays reachable by URL only. */
const STATUS_FILTERS: { label: string; value: ProjectStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Live", value: "live" },
  { label: "In progress", value: "in-progress" },
];

function parseStatus(value: string): ProjectStatus | undefined {
  return value === "live" || value === "in-progress" || value === "archived"
    ? value
    : undefined;
}

interface ProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;
  const tech = firstParam(params.tech);
  const statusParam = firstParam(params.status);
  const status = parseStatus(statusParam);
  const q = firstParam(params.q).trim();
  const page = parsePage(params.page);

  const techFilters = await getTechFilters();
  let result = await getProjects({ tech, status, q, page, pageSize: PAGE_SIZE });
  if (result.total > 0 && page > result.totalPages) {
    result = await getProjects({
      tech,
      status,
      q,
      page: result.totalPages,
      pageSize: PAGE_SIZE,
    });
  }

  const { items, total, totalPages, page: currentPage } = result;
  const filtered = Boolean(tech || status || q);

  return (
    <>
      <PageHero title="Projects" subtitle={site.projectsHeroSubtitle} imageUrl={HERO_IMAGE} priority />

      <Container className="mt-section">
        <div className="flex flex-col items-center gap-6">
          <SearchInput action="/projects" defaultValue={q} placeholder="Search projects" />

          <div className="flex flex-wrap justify-center gap-2">
            <CategoryChip
              label="ALL"
              href={buildQueryHref("/projects", { status, q })}
              active={!tech}
            />
            {techFilters.map((filter) => (
              <CategoryChip
                key={filter.tech}
                label={filter.tech}
                href={buildQueryHref("/projects", { tech: filter.tech, status, q })}
                active={filter.tech === tech}
              />
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {STATUS_FILTERS.map((filter) => (
              <CategoryChip
                key={filter.label}
                label={filter.label}
                href={buildQueryHref("/projects", {
                  tech,
                  status: filter.value,
                  q,
                })}
                active={status === (filter.value || undefined)}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-faint" aria-live="polite">
          Showing {total} {total === 1 ? "project" : "projects"}
        </p>

        {items.length > 0 ? (
          <div
            key={`${tech}-${status}-${q}-${currentPage}`}
            className="mt-6 grid gap-card sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((project, index) => (
              <Reveal key={project.id} delay={(index % 3) * 70} className="h-full">
                <ProjectCard project={project} priority={index < 3} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-6"
            title="No projects found"
            description={
              filtered
                ? "Nothing matches those filters yet. Try a different search or clear the filters."
                : "Projects are on their way. Check back soon."
            }
            action={
              filtered ? (
                <ButtonLink href="/projects" variant="secondary">
                  Clear filters
                </ButtonLink>
              ) : null
            }
          />
        )}

        <Pagination
          className="mt-12"
          page={currentPage}
          total={totalPages}
          hrefFor={(target) =>
            buildQueryHref("/projects", {
              tech,
              status: statusParam,
              q,
              page: target,
            })
          }
        />
      </Container>
    </>
  );
}
