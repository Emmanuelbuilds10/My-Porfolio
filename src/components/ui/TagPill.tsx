import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TagPillProps {
  children: ReactNode;
  /** When set the pill links to the filtered Writing page. */
  href?: string;
  className?: string;
}

/**
 * Solid violet pill used for post categories, project tech-stack items and
 * project statuses. Not interactive unless `href` is supplied.
 */
export function TagPill({ children, href, className }: TagPillProps) {
  const classes = cn(
    "inline-flex max-w-full items-center rounded-pill bg-accent-fill px-3 py-1.5",
    "text-[11px] leading-none font-medium text-on-accent",
    href && "transition-colors duration-200 hover:bg-accent-strong",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        <span className="truncate">{children}</span>
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}
