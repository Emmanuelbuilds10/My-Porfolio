import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  /**
   * Element to render. Stays a `<p>` by default; pass `h2` when the label is
   * the only thing naming a section (e.g. "Featured Post"), so assistive tech
   * and search engines see a heading rather than loose text.
   */
  as?: "p" | "h2";
}

/**
 * The small "● Selected Work" label that sits above every landing section
 * heading. Decorative dot + an uppercase tracked label.
 */
export function Eyebrow({ children, className, as: Tag = "p" }: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.14em] text-body uppercase",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-pill bg-accent" />
      {children}
    </Tag>
  );
}
