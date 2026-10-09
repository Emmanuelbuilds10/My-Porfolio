import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CoverImage } from "@/components/ui/CoverImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { WorkCard } from "@/components/content/WorkCard";
import { listLandingImages } from "@/lib/admin/data";
import { getFeaturedProjects, getProjects } from "@/lib/queries";
import { site } from "@/lib/site";
import type { ContentItem } from "@/lib/types";

/** How many project tiles the landing grid shows — two rows of three. */
const WORK_COUNT = 6;

/**
 * Decorative, looping row of covers under the grid.
 *
 * Two sources, in priority order:
 *   1. `landing_images` — tiles the admin curates in Admin → Landing carousel.
 *   2. published project covers, when the admin hasn't filled the strip yet.
 *
 * Renders nothing until there are at least three tiles, so it never shows a
 * single image sliding past empty space. Purely presentational, hence
 * `aria-hidden` (the managed tiles carry real alt text in the admin only).
 */
const MARQUEE_MINIMUM = 3;

function CoverMarquee({
  projects,
  managed,
}: {
  projects: ContentItem[];
  managed: { id: string; imageUrl: string }[];
}) {
  const tiles =
    managed.length >= MARQUEE_MINIMUM
      ? managed.map((image) => ({ key: image.id, src: image.imageUrl }))
      : projects
          .filter((project) => project.coverImageUrl)
          .slice(0, 12)
          .map((project) => ({ key: project.id, src: project.coverImageUrl! }));

  if (tiles.length < MARQUEE_MINIMUM) return null;

  const track = [...tiles, ...tiles];

  return (
    <div aria-hidden className="mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="animate-marquee flex w-max gap-4">
        {track.map((tile, index) => (
          <div key={`${tile.key}-${index}`} className="w-40 shrink-0 md:w-48">
            <CoverImage src={tile.src} alt="" ratio="card" sizes="192px" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Landing "Selected Work": heading + aside, the project grid, then the strip.
 *
 * Projects starred in the admin ("Show on landing page") take priority; with
 * none starred the grid falls back to the newest published projects so the
 * section is never empty while the site is being set up.
 */
export async function SelectedWork() {
  const [starred, managedImages] = await Promise.all([
    getFeaturedProjects(WORK_COUNT),
    listLandingImages(),
  ]);
  const { items } =
    starred.length > 0
      ? { items: starred }
      : await getProjects({ pageSize: WORK_COUNT });

  return (
    <section id="work" className="mt-section mb-section scroll-mt-24">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div>
            <Eyebrow>{site.workEyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-[520px] font-serif text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.15] text-fg">
              {site.workSubtitle}
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted md:max-w-[380px] md:justify-self-end md:pt-2 md:text-right">
            {site.workSubtitleAside}
          </p>
        </div>

        {items.length > 0 ? (
          <>
            <div className="mt-stack grid gap-block sm:grid-cols-2 lg:grid-cols-3">
              {items.map((project, index) => (
                <Reveal key={project.id} delay={(index % 3) * 70} className="h-full">
                  <WorkCard project={project} priority={index < 3} />
                </Reveal>
              ))}
            </div>

            <CoverMarquee projects={items} managed={managedImages} />
          </>
        ) : (
          <EmptyState
            className="mt-stack"
            title="Selected work coming soon"
            description="Published projects will appear here. In the meantime you can browse the full archive."
            action={
              <ButtonLink href="/projects" variant="secondary">
                Browse projects
              </ButtonLink>
            }
          />
        )}
      </Container>
    </section>
  );
}
