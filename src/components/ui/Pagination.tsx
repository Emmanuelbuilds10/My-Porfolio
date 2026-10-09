import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildPageList } from "@/lib/pagination";

interface PaginationProps {
  page: number;
  total: number;
  /** Builds the href for a page so the active filters survive paging. */
  hrefFor: (page: number) => string;
  className?: string;
}

const CELL =
  "grid size-9 shrink-0 place-items-center rounded-button text-sm transition-colors duration-200 ease-out-soft";

/** Numbered pagination with prev/next arrows. Renders nothing for a single page. */
export function Pagination({ page, total, hrefFor, className }: PaginationProps) {
  if (total <= 1) return null;

  const pages = buildPageList(page, total);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <PageArrow
        href={hrefFor(page - 1)}
        disabled={page <= 1}
        label="Previous page"
        direction="previous"
      />

      <ul className="flex items-center gap-2">
        {pages.map((entry, index) =>
          entry === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              aria-hidden
              className="px-1 text-sm text-faint select-none"
            >
              …
            </li>
          ) : (
            <li key={entry}>
              <Link
                href={hrefFor(entry)}
                aria-label={`Page ${entry}`}
                aria-current={entry === page ? "page" : undefined}
                className={cn(
                  CELL,
                  entry === page
                    ? "bg-accent font-medium text-on-accent"
                    : "text-muted hover:bg-accent-soft hover:text-accent",
                )}
              >
                {entry}
              </Link>
            </li>
          ),
        )}
      </ul>

      <PageArrow
        href={hrefFor(page + 1)}
        disabled={page >= total}
        label="Next page"
        direction="next"
      />
    </nav>
  );
}

function PageArrow({
  href,
  disabled,
  label,
  direction,
}: {
  href: string;
  disabled: boolean;
  label: string;
  direction: "previous" | "next";
}) {
  const shared = cn(
    "grid size-9 place-items-center rounded-pill border border-line-strong",
    "transition-colors duration-200 ease-out-soft",
  );
  const icon =
    direction === "previous" ? (
      <ArrowLeft aria-hidden className="size-4" />
    ) : (
      <ArrowRight aria-hidden className="size-4" />
    );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        aria-label={label}
        className={cn(shared, "text-faint opacity-45")}
      >
        {icon}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(shared, "text-muted hover:border-accent hover:text-accent")}
    >
      {icon}
    </Link>
  );
}
