"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { site, testimonials } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Landing testimonials carousel.
 *
 * A single keyed card swapped by prev/next; the live region announces the new
 * quote to screen readers. Client-side because it holds the active index —
 * the copy itself comes from `site.ts` (there is no testimonials table yet).
 */
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const current = testimonials[index];

  function go(delta: number) {
    setIndex((value) => (value + delta + count) % count);
  }

  return (
    <section id="testimonials" className="mt-section scroll-mt-24">
      <Container>
        <Reveal className="mx-auto max-w-[640px] text-center">
          <Eyebrow className="justify-center">{site.testimonialsEyebrow}</Eyebrow>
          <h2 className="mt-4 font-serif text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.15] text-fg">
            {site.testimonialsSubtitle}
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-stack flex items-center gap-4 md:gap-8">
          <CarouselButton label="Previous testimonial" onClick={() => go(-1)} direction="previous" />

          <div
            key={current.id}
            className="animate-field-in grid flex-1 overflow-hidden rounded-card border border-line bg-veil md:grid-cols-[260px_minmax(0,1fr)]"
          >
            <div
              className={cn(
                "grid min-h-[220px] place-items-center",
                "bg-[radial-gradient(120%_100%_at_20%_0%,var(--color-accent-soft),transparent_65%)]",
              )}
            >
              <span aria-hidden className="font-serif text-6xl text-fg/70">
                {current.name.trim().charAt(0)}
              </span>
            </div>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <p aria-live="polite" className="text-base leading-8 text-body md:text-lg">
                {current.quote}
              </p>
              <p className="mt-6 text-sm font-semibold text-fg">{current.name}</p>
              <p className="text-xs text-faint">{current.role}</p>
            </div>
          </div>

          <CarouselButton label="Next testimonial" onClick={() => go(1)} direction="next" />
        </Reveal>
      </Container>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  direction,
}: {
  label: string;
  onClick: () => void;
  direction: "previous" | "next";
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-pill border border-line-strong text-muted",
        "transition-colors duration-200 ease-out-soft",
        "hover:border-accent hover:text-accent",
      )}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  );
}
