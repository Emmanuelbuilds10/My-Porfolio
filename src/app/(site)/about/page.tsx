import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { FactCard } from "@/components/content/FactCard";
import { GithubIcon, TwitterIcon } from "@/components/icons";
import { getFacts, getSiteSettings } from "@/lib/queries";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: site.aboutHeroSubtitle,
  alternates: { canonical: "/about" },
};

/**
 * About page. Everything here is admin-editable: identity + bio come from
 * `site_settings` (bio is stored as markdown and split into paragraphs), the
 * cards come from `facts`. When the database isn't configured the page falls
 * back to the static site identity so it still renders cleanly.
 */
export default async function AboutPage() {
  const [settings, facts] = await Promise.all([getSiteSettings(), getFacts()]);

  const name = settings?.name ?? site.name;
  const role = settings?.role ?? site.role;
  const location = settings?.location ?? null;
  const bioParagraphs = settings?.bioParagraphs ?? [];
  const avatarUrl = settings?.avatarUrl ?? null;
  const email = settings ? settings.email : site.email;
  const twitterUrl = settings ? settings.twitterUrl : site.twitterUrl;
  const githubUrl = settings ? settings.githubUrl : site.githubUrl;

  return (
    <Container className="pb-section">
      <div className="max-w-[720px] pt-16">
        <Reveal delay={0}>
          <Avatar
            src={avatarUrl}
            name={name}
            size="lg"
            className="transition-transform duration-300 ease-out-soft hover:scale-[1.03] motion-reduce:hover:scale-100"
          />
        </Reveal>

        <Reveal delay={80}>
          <h1 className="mt-6 font-serif text-2xl text-fg md:text-[1.75rem]">{name}</h1>
          <p className="mt-1 text-sm text-muted">
            {role}
            {location ? ` · ${location}` : ""}
          </p>
        </Reveal>

        {bioParagraphs.length > 0 ? (
          <div className="mt-8 space-y-5">
            {bioParagraphs.map((paragraph, index) => (
              <Reveal key={index} delay={160 + index * 80}>
                <p className="text-[15px] leading-7 text-muted">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>

      {facts.length > 0 ? (
        <section className="mt-section">
          <h2 className="font-serif text-[clamp(1.6rem,3vw,2rem)] text-fg">
            A few facts
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact, index) => (
              <Reveal key={fact.id} delay={index * 70} className="h-full">
                <FactCard fact={fact} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-section">
        <div className="rounded-card bg-panel px-6 py-14 text-center md:py-16">
          <h2 className="font-serif text-2xl text-fg md:text-[1.75rem]">
            {site.sayHelloTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-[420px] text-sm leading-relaxed text-muted">
            {site.sayHelloBody}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {email ? (
              <ButtonLink href={`mailto:${email}`}>
                <Mail aria-hidden className="size-4" />
                Email me
              </ButtonLink>
            ) : null}
            {twitterUrl ? (
              <ButtonLink href={twitterUrl} variant="secondary">
                <TwitterIcon className="size-4" />
                Follow on twitter
              </ButtonLink>
            ) : null}
            {githubUrl ? (
              <ButtonLink href={githubUrl}>
                <GithubIcon className="size-4" />
                Github
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </section>
    </Container>
  );
}
