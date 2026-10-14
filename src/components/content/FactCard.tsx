import {
  Book,
  Briefcase,
  Clock,
  Code,
  Globe,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Fact } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Icon keys the `facts.icon` column accepts (see the seed + Phase 4 admin).
 * Unknown values fall back to Sparkles so a bad row can never break About.
 */
export const factIcons: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  code: Code,
  briefcase: Briefcase,
  mail: Mail,
  globe: Globe,
  heart: Heart,
  book: Book,
  clock: Clock,
  sparkles: Sparkles,
};

export const factIconKeys = Object.keys(factIcons);

interface FactCardProps {
  fact: Fact;
  className?: string;
}

/** One card in the About page's "A few facts" grid. */
export function FactCard({ fact, className }: FactCardProps) {
  const Icon = factIcons[fact.icon] ?? Sparkles;

  return (
    <div
      className={cn(
        "rounded-card bg-panel p-6",
        "transition-transform duration-300 ease-out-soft",
        "hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-button bg-accent-soft text-accent-text">
        <Icon aria-hidden className="size-5" />
      </span>
      <p className="mt-4 text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
        {fact.label}
      </p>
      <p className="mt-1 text-sm text-fg">{fact.value}</p>
    </div>
  );
}
