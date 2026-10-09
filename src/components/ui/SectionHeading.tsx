import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  /** Optional trailing action, e.g. "See all writing →". */
  action?: ReactNode;
  className?: string;
  id?: string;
}

/** Section title on the left, optional link on the right. */
export function SectionHeading({ title, action, className, id }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between gap-6", className)}>
      <h2 id={id} className="font-serif text-2xl text-fg md:text-3xl">
        {title}
      </h2>
      {action}
    </div>
  );
}
