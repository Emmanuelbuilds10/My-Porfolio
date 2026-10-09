"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, RotateCcw, Star, Trash2, Upload } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { deleteContent, toggleFeatured, togglePublish } from "@/lib/admin/actions/content";
import type { ContentType, PublishStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ContentRowActionsProps {
  id: string;
  title: string;
  type: ContentType;
  slug: string;
  publishStatus: PublishStatus;
  /** Project rows only: marks the item for the landing page's Selected Work. */
  featured?: boolean;
}

export function ContentRowActions({
  id,
  title,
  type,
  slug,
  publishStatus,
  featured = false,
}: ContentRowActionsProps) {
  const router = useRouter();
  const toast = useToast();
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const published = publishStatus === "published";
  const publicHref = type === "post" ? `/writing/${slug}` : `/projects/${slug}`;

  async function run(action: () => Promise<{ ok: boolean; message: string }>) {
    setBusy(true);
    const result = await action();
    setBusy(false);
    if (result.ok) {
      toast.success(result.message);
      startTransition(() => router.refresh());
    } else {
      toast.error(result.message);
    }
  }

  const iconButton =
    "grid size-8 place-items-center rounded-button text-muted transition-colors hover:bg-accent-soft hover:text-accent disabled:opacity-50";

  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/${id}/edit`} className={iconButton} title="Edit">
        <Pencil aria-hidden className="size-3.5" />
        <span className="sr-only">Edit {title}</span>
      </Link>

      <button
        type="button"
        disabled={busy}
        onClick={() => void run(() => togglePublish(id, !published))}
        className={iconButton}
        title={published ? "Unpublish" : "Publish"}
      >
        {published ? (
          <RotateCcw aria-hidden className="size-3.5" />
        ) : (
          <Upload aria-hidden className="size-3.5" />
        )}
        <span className="sr-only">{published ? "Unpublish" : "Publish"} {title}</span>
      </button>

      {type === "project" ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void run(() => toggleFeatured(id, !featured))}
          className={cn(iconButton, featured && "text-accent")}
          title={featured ? "Remove from landing page" : "Show on landing page"}
        >
          <Star aria-hidden className={cn("size-3.5", featured && "fill-current")} />
          <span className="sr-only">
            {featured ? "Remove" : "Add"} {title} {featured ? "from" : "to"} the landing page
          </span>
        </button>
      ) : null}

      {published ? (
        <Link
          href={publicHref}
          target="_blank"
          className={iconButton}
          title="View public page"
        >
          <Eye aria-hidden className="size-3.5" />
          <span className="sr-only">View {title}</span>
        </Link>
      ) : (
        <span className={cn(iconButton, "cursor-not-allowed opacity-40")} title="Not published">
          <Eye aria-hidden className="size-3.5" />
        </span>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={() => setConfirming(true)}
        className={cn(iconButton, "hover:bg-danger-soft hover:text-danger")}
        title="Delete"
      >
        <Trash2 aria-hidden className="size-3.5" />
        <span className="sr-only">Delete {title}</span>
      </button>

      <ConfirmDialog
        open={confirming}
        title={`Delete “${title}”?`}
        description="This permanently removes the item. It cannot be undone."
        pending={busy}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          void run(() => deleteContent(id));
        }}
      />
    </div>
  );
}
