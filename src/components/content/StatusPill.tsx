import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
};

const STYLES: Record<ProjectStatus, string> = {
  live: "bg-success-soft text-success",
  "in-progress": "bg-warn/15 text-warn",
  archived: "bg-panel text-muted",
};

interface StatusPillProps {
  status: ProjectStatus;
  className?: string;
}

/** Project status chip (card + detail header). Colour-coded, not interactive. */
export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[11px] leading-none font-medium",
        STYLES[status],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-pill bg-current" />
      {LABELS[status]}
    </span>
  );
}
