import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TagPill } from "@/components/ui/TagPill";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CoverImage } from "@/components/ui/CoverImage";
import { PostCard } from "@/components/content/PostCard";
import { ProjectCard } from "@/components/content/ProjectCard";
import { StatusPill } from "@/components/content/StatusPill";
import { FeaturedPost } from "@/components/content/FeaturedPost";
import { FactCard } from "@/components/content/FactCard";
import { AuthorCard } from "@/components/content/AuthorCard";
import { NewsletterCard } from "@/components/content/NewsletterCard";
import { facts, posts, projects, siteSettings } from "@/content/fixtures";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

/**
 * Living reference for the design system: every token and every base
 * component in every state. Kept in the repo so a component can be checked
 * without hunting for the one page that happens to use it.
 */
export default function StyleGuidePage() {
  const samplePosts = posts.slice(1, 4);
  const featured = posts[0];

  return (
    <Container className="space-y-section py-section">
      <header>
        <h1 className="font-serif text-[clamp(1.75rem,4vw,2.5rem)] text-fg">
          Style guide
        </h1>
        <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-muted">
          Every value below comes from a token in{" "}
          <code className="rounded bg-well px-1.5 py-0.5 text-xs">
            src/app/globals.css
          </code>
          . Components never hardcode a colour, radius or font.
        </p>
      </header>

      <Section title="Surfaces & colour">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          <Swatch token="--color-canvas" className="bg-canvas ring-1 ring-line" />
          <Swatch token="--color-veil" className="bg-veil" />
          <Swatch token="--color-well" className="bg-well" />
          <Swatch token="--color-panel" className="bg-panel" />
          <Swatch token="--color-accent" className="bg-accent" />
          <Swatch token="--color-accent-strong" className="bg-accent-strong" />
          <Swatch token="--color-line" className="bg-line" />
          <Swatch token="--color-line-strong" className="bg-line-strong" />
          <Swatch token="--color-fg" className="bg-fg" />
          <Swatch token="--color-body" className="bg-body" />
          <Swatch token="--color-muted" className="bg-muted" />
          <Swatch token="--color-faint" className="bg-faint" />
          <Swatch token="--color-success" className="bg-success" />
          <Swatch token="--color-danger" className="bg-danger" />
          <Swatch token="--color-warn" className="bg-warn" />
          <Swatch
            token="--color-accent-soft"
            className="bg-accent-soft ring-1 ring-line"
          />
        </div>
      </Section>

      <Section title="Typography">
        <div className="space-y-6">
          <p className="font-serif text-4xl text-fg">Fraunces — display serif</p>
          <p className="font-serif text-2xl text-fg">Fraunces — section heading</p>
          <p className="font-serif text-[17px] text-fg">Fraunces — card title</p>
          <p className="font-sans text-base text-body">
            Source Sans 3 — long-form reading copy, set at 1.75 line height so a
            paragraph stays comfortable at any measure.
          </p>
          <p className="text-sm text-muted">Source Sans 3 — excerpt / secondary</p>
          <p className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
            Source Sans 3 — meta line
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="space-y-6">
          <Row label="Variants">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="States">
            <Button loading>Subscribing</Button>
            <Button disabled>Disabled</Button>
            <ButtonLink href="/writing">Link button</ButtonLink>
            <ButtonLink href="/writing" variant="secondary">
              Secondary link
            </ButtonLink>
          </Row>
        </div>
      </Section>

      <Section title="Pills & chips">
        <div className="space-y-6">
          <Row label="Tag pills">
            <TagPill>Design</TagPill>
            <TagPill>Creative Solutions</TagPill>
            <TagPill href="/writing?category=design">Linked pill</TagPill>
          </Row>
          <Row label="Category chips">
            <CategoryChip label="ALL" href="#" active />
            <CategoryChip label="Technology" href="#" />
            <CategoryChip label="Dev & Code" href="#" />
            <CategoryChip label="Lessons" href="#" />
          </Row>
        </div>
      </Section>

      <Section title="Search & pagination">
        <div className="space-y-8">
          <SearchInput defaultValue="design systems" />
          <Pagination page={3} total={5} hrefFor={(page) => `#page-${page}`} />
          <Pagination page={1} total={1} hrefFor={(page) => `#page-${page}`} />
        </div>
      </Section>

      <Section title="Section heading">
        <SectionHeading
          title="Latest Post"
          action={
            <span className="text-sm text-muted">See all writing →</span>
          }
        />
      </Section>

      <Section title="Cover ratios">
        <div className="grid gap-6 sm:grid-cols-3">
          <CoverImage alt="Card ratio" ratio="card" />
          <CoverImage alt="Featured ratio" ratio="featured" />
          <CoverImage alt="Cover ratio" ratio="cover" />
        </div>
      </Section>

      <Section title="Featured post">
        <FeaturedPost post={featured} />
      </Section>

      <Section title="Post cards (3 / 2 / 1 columns)">
        <div className="grid gap-card sm:grid-cols-2 lg:grid-cols-3">
          {samplePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Section>

      <Section title="Status pills">
        <Row label="Project status">
          <StatusPill status="live" />
          <StatusPill status="in-progress" />
          <StatusPill status="archived" />
        </Row>
      </Section>

      <Section title="Project cards (3 / 2 / 1 columns)">
        <div className="grid gap-card sm:grid-cols-2 lg:grid-cols-3">
          {projects
            .filter((project) => project.publishStatus === "published")
            .map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </div>
      </Section>

      <Section title="Fact cards">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <FactCard key={fact.id} fact={fact} />
          ))}
        </div>
      </Section>

      <Section title="Author card">
        <AuthorCard
          name={siteSettings.name}
          role={siteSettings.role}
          avatarUrl={siteSettings.avatarUrl}
        >
          <Button size="sm" variant="secondary">
            Share
          </Button>
          <Button size="sm" variant="secondary">
            Copy link
          </Button>
        </AuthorCard>
      </Section>

      <Section title="Newsletter">
        <NewsletterCard />
      </Section>

      <Section title="Markdown body (.prose-post)">
        <div className="prose-post max-w-[680px]">
          <h3>Elevate Your Development Game Today: Tips for Web Developers</h3>
          <p>
            In the fast-paced world of web development, staying ahead of the
            curve is essential. Here are some key strategies to elevate your
            development game today:
          </p>
          <ol>
            <li>
              <strong>Embrace Modern Frameworks:</strong> Frameworks like React
              and Next.js can streamline your development process.
            </li>
            <li>
              <strong>Focus on User Experience:</strong> Always keep the user in
              mind. Small tweaks lead to significant improvements.
            </li>
          </ol>
          <blockquote>Motion is feedback, not decoration.</blockquote>
          <p>
            Run{" "}
            <code className="text-sm">estimateReadTime(body)</code> whenever a
            body changes.
          </p>
        </div>
      </Section>
    </Container>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line pt-10">
      <h2 className="font-serif text-xl text-fg">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function Swatch({ token, className }: { token: string; className: string }) {
  return (
    <div>
      <div className={`h-16 rounded-media ${className}`} />
      <p className="mt-2 font-mono text-[10px] break-all text-faint">{token}</p>
    </div>
  );
}
