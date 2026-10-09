import Image from "next/image";
import { Play } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteSettings } from "@/lib/queries";
import { heroSkills, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Same fallback portrait the hero uses, so the two never disagree. */
const PORTRAIT = "/images/portrait.svg";

/** Where each skill chip floats around the medallion, as absolute offsets. */
const CHIP_POSITIONS: Record<(typeof heroSkills)[number]["position"], string> = {
  "top-left": "top-[2%] left-[-8%]",
  "top-right": "top-[15%] right-[-10%]",
  "mid-left": "top-[37%] left-[-14%]",
  "mid-right": "top-[49%] right-[-12%]",
  "low-left": "top-[69%] left-[-12%]",
  "low-right": "top-[84%] left-[-6%]",
};

/** Solid black chip with white type — the design floats these around the face. */
function SkillChip({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-media bg-black px-3.5 py-2 text-xs font-medium whitespace-nowrap text-white",
        "ring-1 ring-white/10",
        className,
      )}
    >
      {label}
    </span>
  );
}

/**
 * Landing "Hello" section: the portrait medallion with its floating skill
 * chips, paired with the bio and a call to action.
 *
 * Identity and bio come from `site_settings` when configured and fall back to
 * `site.ts` otherwise, so the section always reads as finished.
 */
export async function AboutPreview() {
  const settings = await getSiteSettings();
  const name = settings?.name ?? site.name;
  const bio = settings?.bioParagraphs?.length ? settings.bioParagraphs : site.aboutBio;
  const avatarUrl = settings?.avatarUrl ?? null;

  return (
    <section id="about" className="relative mt-section scroll-mt-24">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* ---- Portrait medallion + floating skill chips ---- */}
          <Reveal className="relative mx-auto w-full max-w-[420px]">
            <span
              aria-hidden
              className="animate-float absolute -top-6 left-2 text-4xl [animation-delay:0.4s] md:text-5xl"
            >
              😎
            </span>
            <span
              aria-hidden
              className="animate-float absolute -bottom-2 -left-2 text-3xl [animation-delay:1.6s] md:text-4xl"
            >
              🚀
            </span>
            <span
              aria-hidden
              className="animate-float absolute top-1/3 right-2 text-3xl [animation-delay:1s] md:text-4xl"
            >
              🤩
            </span>

            <div className="relative aspect-square">
              <div
                aria-hidden
                className="animate-pulse-glow absolute inset-0 rounded-pill bg-[radial-gradient(70%_70%_at_50%_40%,var(--color-accent-veil),transparent_72%)] blur-2xl"
              />
              <Image
                src={avatarUrl ?? PORTRAIT}
                alt={`Portrait of ${name}`}
                fill
                sizes="(min-width: 1024px) 420px, 380px"
                className="rounded-pill object-cover"
              />
            </div>

            {/* Decorative only: the list below repeats the same labels. */}
            <div aria-hidden className="absolute inset-0 hidden sm:block">
              {heroSkills.map((skill, index) => (
                <span
                  key={skill.label}
                  style={{ animationDelay: `${index * 0.7}s` }}
                  className={cn("animate-float absolute", CHIP_POSITIONS[skill.position])}
                >
                  <SkillChip label={skill.label} />
                </span>
              ))}
            </div>

            <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:hidden">
              {heroSkills.map((skill) => (
                <li key={skill.label}>
                  <SkillChip label={skill.label} />
                </li>
              ))}
            </ul>
          </Reveal>

          {/* ---- Identity + bio ---- */}
          <Reveal delay={120} className="mx-auto w-full max-w-[560px]">
            <div className="flex items-center gap-3">
              <Avatar src={avatarUrl} name={name} size="sm" />
              <div>
                <Eyebrow>{site.aboutEyebrow}</Eyebrow>
                <p className="mt-0.5 text-sm text-fg">{site.heroHandle}</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {bio.map((paragraph, index) => (
                <p key={index} className="text-[15px] leading-7 text-muted">
                  {paragraph}
                </p>
              ))}
            </div>

            <ButtonLink href="/#contact" size="lg" className="mt-8">
              <Play aria-hidden className="size-4 fill-current" />
              {site.aboutCtaLabel}
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
