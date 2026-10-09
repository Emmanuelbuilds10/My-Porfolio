import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Swap the wrapper element when the container is an `<article>`/`<section>`. */
  as?: ElementType;
  /** Narrow reading measure for long-form pages (post bodies, about bio). */
  size?: "wide" | "prose";
}

const SIZES = {
  wide: "max-w-[1240px]",
  prose: "max-w-[680px]",
} as const;

/** Centred page gutter. Every section on every page sits inside one of these. */
export function Container({
  children,
  className,
  as: Tag = "div",
  size = "wide",
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-6 md:px-8", SIZES[size], className)}>
      {children}
    </Tag>
  );
}
