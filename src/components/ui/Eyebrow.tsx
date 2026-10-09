import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/**
 * The small "● Selected Work" label that sits above every landing section
 * heading. Decorative dot + an uppercase tracked label.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.14em] text-body uppercase",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-pill bg-accent" />
      {children}
    </p>
  );
}
