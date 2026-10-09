import { BackdropImage } from "@/components/ui/BackdropImage";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Full-bleed background. Falls back to a violet wash when missing. */
  imageUrl?: string | null;
  /** "THE BLOG" is set in caps; "Writing" is not. */
  uppercaseTitle?: boolean;
  priority?: boolean;
  className?: string;
}

/**
 * Full-bleed page header: violet-duotoned photo, centred serif title and a
 * short subtitle. Used on Home, Writing, Projects and About.
 *
 * The background sits inside `data-parallax-layer` so Phase 5 can attach the
 * scroll parallax without touching this markup.
 */
export function PageHero({
  title,
  subtitle,
  imageUrl,
  uppercaseTitle = false,
  priority = false,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex h-[300px] w-full items-center overflow-hidden md:h-[340px]",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-20 bg-canvas" />

      {imageUrl ? (
        <div aria-hidden data-parallax-layer className="absolute inset-0 -z-10">
          <BackdropImage
            src={imageUrl}
            priority={priority}
            className="opacity-60 mix-blend-luminosity"
          />
        </div>
      ) : null}

      {/* Violet duotone wash + a soft vignette so the title always has contrast. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-accent-veil" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-canvas/50 via-canvas/20 to-canvas/80"
      />

      <Container className="text-center">
        <h1
          className={cn(
            "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-fg",
            uppercaseTitle && "tracking-[0.04em] uppercase",
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-[560px] text-sm text-fg/85 md:text-base">
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
