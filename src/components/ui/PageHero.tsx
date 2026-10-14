import { BackdropImage } from "@/components/ui/BackdropImage";
import { Container } from "@/components/ui/Container";
import { HERO_IMAGE } from "@/lib/hero-image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /**
   * Full-bleed backdrop the copy sits on. Defaults to the site-wide
   * `HERO_IMAGE` (the admin-editable `NEXT_PUBLIC_HERO_IMAGE_URL` when set).
   */
  imageUrl?: string | null;
  /** "THE BLOG" is set in caps; "Writing" is not. */
  uppercaseTitle?: boolean;
  priority?: boolean;
  className?: string;
}

/**
 * Banner header for the archive pages (Writing, Projects): a full-bleed photo
 * with the title and subtitle laid over it.
 *
 * The photo is darkened twice — a flat wash plus a top/bottom gradient — and
 * tinted violet, so the white copy keeps its contrast no matter which image is
 * dropped in. Swap the picture per page with `imageUrl`; nothing else needs to
 * change.
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
  const backdrop = imageUrl ?? HERO_IMAGE;

  return (
    <section
      className={cn(
        "relative isolate flex h-[300px] w-full items-center overflow-hidden md:h-[400px]",
        className,
      )}
    >
      <div aria-hidden className="absolute inset-0 -z-20 bg-canvas" />

      {backdrop ? (
        <div aria-hidden data-parallax-layer className="absolute inset-0 -z-10">
          <BackdropImage src={backdrop} priority={priority} className="opacity-85 object-cover" />
        </div>
      ) : null}

      {/* Violet cast + two layers of darkening keep the copy readable. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-accent-veil opacity-45" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-canvas/55" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-canvas/70 via-canvas/30 to-canvas/80"
      />

      <Container className="relative text-center">
        <h1
          className={cn(
            "text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] text-fg",
            uppercaseTitle && "tracking-[0.04em] uppercase",
          )}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-[560px] text-sm text-fg md:text-base">{subtitle}</p>
        ) : null}
      </Container>
    </section>
  );
}
