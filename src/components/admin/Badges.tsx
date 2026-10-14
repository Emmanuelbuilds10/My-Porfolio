import type { ContentType, PublishStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<ContentType, string> = {
  post: "bg-accent-fill text-on-accent",
  // Second accent (sky) so Posts and Projects never read the same at a glance.
  project: "bg-info-soft text-info",
};

export function TypeBadge({ type, className }: { type: ContentType; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-[11px] leading-none font-medium",
        TYPE_STYLES[type],
        className,
      )}
    >
      {type === "post" ? "Post" : "Project"}
    </span>
  );
}

const STATUS_LABELS: Record<PublishStatus, string> = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
};

const STATUS_STYLES: Record<PublishStatus, string> = {
  published: "bg-success-soft text-success",
  draft: "bg-panel text-muted ring-1 ring-line-strong",
  scheduled: "bg-warn/15 text-warn",
};

export function StatusBadge({
  status,
  className,
}: {
  status: PublishStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-[11px] leading-none font-medium",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
