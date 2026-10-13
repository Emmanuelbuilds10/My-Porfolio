import Image from "next/image";
import { Play } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getSiteSettings } from "@/lib/queries";
import { site } from "@/lib/site";

/**
 * The hero portrait. The site_settings avatar (the same one the "Hello"
 * section uses) wins; `/images/portrait.svg` ships with the repo as a fallback
 * so the hero is never a broken image. Drop a photo at the same path to swap
 * it, no code change needed.
 */
const PORTRAIT = "/images/portrait.svg";

/**
 * Landing hero: positioning headline on the left, the portrait in the middle,
 * the supporting paragraph and call to action on the right, closed by the
 * oversized solid wordmark.
 *
 * The wordmark is a grid item too, ordered between the portrait and the
 * supporting copy. On small screens the grid is a single column, so the name
 * lands directly under the portrait instead of after the paragraph and button;
 * from `lg` it drops to `order-4` and spans all three columns, which restores
 * the full-width lockup under the row.
 *
 * The wordmark is decorative repetition of the name — the `h1` carries the real
 * page heading — and is set fluidly so it always spans the container edge to
 * edge without overflowing.
 */
export async function PortfolioHero() {
  const settings = await getSiteSettings();
  const avatarUrl = settings?.avatarUrl ?? null;
  return (
    <section className="relative isolate overflow-hidden pt-12 md:pt-16">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
          {/* ---- Positioning headline ---- */}
          <div className="animate-fade-up order-1 lg:pt-6">
            <Eyebrow>{site.availabilityLabel}</Eyebrow>
            <h1 className="mt-5 font-serif text-[clamp(2.1rem,4vw,3.1rem)] leading-[1.08] text-fg">
              {site.heroTitle}
            </h1>
          </div>

          {/* ---- Portrait ---- */}
          <div className="animate-fade-up relative order-2 mx-auto w-full max-w-[420px] [animation-delay:120ms]">
            <div className="animate-float relative aspect-square">
              <div
                aria-hidden
                className="animate-pulse-glow absolute inset-0 rounded-pill bg-[radial-gradient(70%_70%_at_50%_38%,var(--color-accent-veil),transparent_72%)] blur-2xl"
              />
              <Image
                src={avatarUrl ?? PORTRAIT}
                alt={`Portrait of ${site.name}`}
                fill
                priority
                sizes="(min-width: 1024px) 420px, 380px"
                className="hero-portrait-fade rounded-pill object-cover"
              />
            </div>
          </div>

          {/* ---- Oversized wordmark ---- */}
          <p
            aria-hidden
            className="animate-fade-up order-3 -mt-6 text-center text-[clamp(3rem,17vw,13.5rem)] leading-[0.82] font-bold tracking-[-0.03em] text-fg [animation-delay:320ms] lg:order-4 lg:col-span-3 lg:mt-4"
          >
            {site.name}
          </p>

          {/* ---- Supporting copy + CTA ---- */}
          <div className="animate-fade-up order-4 lg:order-3 lg:pt-6 [animation-delay:240ms]">
            <p className="text-sm leading-7 text-muted">{site.heroSubtitle}</p>
            <ButtonLink href="/#work" size="lg" className="mt-6">
              <Play aria-hidden className="size-4 fill-current" />
              View my work
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
