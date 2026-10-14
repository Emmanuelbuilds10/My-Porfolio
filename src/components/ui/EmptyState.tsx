import { SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional recovery action, e.g. a "Clear filters" link. */
  action?: ReactNode;
  className?: string;
}

/** Shared empty state for the Writing and Projects indexes. */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-panel/40 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="mx-auto grid size-12 place-items-center rounded-pill bg-accent-soft text-accent-text">
        <SearchX aria-hidden className="size-5" />
      </span>
      <p className="mt-5 font-serif text-xl text-fg">{title}</p>
      {description ? (
        <p className="mx-auto mt-2 max-w-[420px] text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">{action}</div>
      ) : null}
    </div>
  );
}
