import { Aperture, PenTool, Rocket, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { processSteps, site } from "@/lib/site";

/**
 * Icon keys the `processSteps` entries use. Anything unrecognised falls back to
 * the searching glass so a typo can never blank out a whole step.
 */
const STEP_ICONS: Record<string, LucideIcon> = {
  search: Search,
  "pen-tool": PenTool,
  aperture: Aperture,
  rocket: Rocket,
};

/** Landing "How It Works": a heading pair, then the three process steps. */
export function HowItWorks() {
  return (
    <section id="process" className="mt-section scroll-mt-24">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div>
            <Eyebrow>{site.processEyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-[520px] font-serif text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.15] text-fg">
              {site.processHeading}
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted md:max-w-[380px] md:justify-self-end md:pt-2 md:text-right">
            {site.processSubtitle}
          </p>
        </div>

        <ol className="relative mt-stack grid gap-8 md:grid-cols-3">
          {/* Dashed connector threaded behind the icon boxes on wide screens. */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-7 hidden border-t border-dashed border-line-strong md:block"
          />

          {processSteps.map((step, index) => {
            const Icon = STEP_ICONS[step.icon] ?? Search;

            return (
              <li key={step.title} className="relative z-10 flex flex-col items-center text-center">
                <Reveal delay={index * 90} className="flex flex-col items-center">
                  <span className="grid size-14 place-items-center rounded-card border border-line-strong bg-veil text-fg">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-lg text-fg">{step.title}</h3>
                  <p className="mt-2 max-w-[320px] text-sm leading-7 text-muted">
                    {step.description}
                  </p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
