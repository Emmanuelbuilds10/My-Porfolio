"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCheck, Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, rowBase, tdBase } from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/Toast";
import {
  deleteMessage,
  markAllMessagesRead,
  setMessageRead,
} from "@/lib/admin/actions/messages";
import type { AdminMessage, MessageTab } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

const inputClass =
  "h-10 w-[260px] rounded-button border border-line-strong bg-well px-4 text-sm text-fg outline-none transition-colors focus:border-accent";

const TABS: { value: MessageTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

export function MessagesManager({
  rows,
  tab,
  q,
  page,
  totalPages,
  unreadCount,
}: {
  rows: AdminMessage[];
  tab: MessageTab;
  q: string;
  page: number;
  totalPages: number;
  unreadCount: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const [deleting, setDeleting] = useState<AdminMessage | null>(null);
  const [busy, setBusy] = useState(false);

  function hrefFor(target: MessageTab | number) {
    const params = new URLSearchParams();
    const nextTab = typeof target === "string" ? target : tab;
    if (nextTab !== "all") params.set("tab", nextTab);
    if (q) params.set("q", q);
    if (typeof target === "number" && target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/admin/messages?${query}` : "/admin/messages";
  }

  async function toggleRead(message: AdminMessage) {
    const result = await setMessageRead(message.id, !message.isRead);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function readAll() {
    setBusy(true);
    const result = await markAllMessagesRead();
    setBusy(false);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    const result = await deleteMessage(deleting.id);
    setBusy(false);
    if (result.ok) {
      toast.success(result.message);
      setDeleting(null);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((entry) => (
            <Link
              key={entry.value}
              href={hrefFor(entry.value)}
              aria-current={tab === entry.value ? "page" : undefined}
              className={cn(
                "rounded-button px-3 py-1.5 text-xs",
                tab === entry.value
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:text-fg",
              )}
            >
              {entry.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form action="/admin/messages" method="get" role="search" className="flex gap-2">
            {tab !== "all" ? <input type="hidden" name="tab" value={tab} /> : null}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search name, email or text"
              className={inputClass}
            />
            <Button type="submit" variant="secondary" size="sm">
              Search
            </Button>
          </form>
          <Button
            variant="secondary"
            size="sm"
            onClick={readAll}
            loading={busy}
            disabled={unreadCount === 0}
          >
            <CheckCheck aria-hidden className="size-4" />
            Mark all read
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-card border border-line bg-panel/40 px-5 py-10 text-center text-sm text-muted">
          {q || tab !== "all"
            ? "No messages match those filters."
            : "No messages yet — submissions from the landing contact form land here."}
        </p>
      ) : (
        <DataTable columns={["From", "Message", "Received", "Actions"]}>
          {rows.map((row) => (
            <tr key={row.id} className={cn(rowBase, !row.isRead && "bg-accent-soft/40")}>
              <td className={cn(tdBase, "min-w-[180px]")}>
                <p className={cn("font-medium", row.isRead ? "text-muted" : "text-fg")}>
                  {row.firstName} {row.lastName}
                </p>
                <a
                  href={`mailto:${row.email}`}
                  className="text-xs text-muted transition-colors hover:text-accent"
                >
                  {row.email}
                </a>
                {row.phone ? (
                  <p className="mt-0.5 text-xs text-faint">{row.phone}</p>
                ) : null}
              </td>
              <td className={cn(tdBase, "max-w-[420px]")}>
                <p
                  className={cn(
                    "line-clamp-3 whitespace-pre-line text-sm",
                    row.isRead ? "text-muted" : "text-body",
                  )}
                >
                  {row.message}
                </p>
              </td>
              <td className={cn(tdBase, "whitespace-nowrap text-faint")}>
                {new Date(row.createdAt).toLocaleString()}
              </td>
              <td className={tdBase}>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void toggleRead(row)}
                    aria-label={row.isRead ? "Mark as unread" : "Mark as read"}
                  >
                    {row.isRead ? (
                      <Mail aria-hidden className="size-3.5" />
                    ) : (
                      <MailOpen aria-hidden className="size-3.5" />
                    )}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleting(row)}>
                    <Trash2 aria-hidden className="size-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((target) => (
            <Link
              key={target}
              href={hrefFor(target)}
              aria-current={target === page ? "page" : undefined}
              className={cn(
                "grid size-9 place-items-center rounded-button text-sm",
                target === page
                  ? "bg-accent text-on-accent"
                  : "text-muted hover:bg-accent-soft hover:text-accent",
              )}
            >
              {target}
            </Link>
          ))}
        </nav>
      ) : null}

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete the message from ${deleting?.firstName ?? ""} ${deleting?.lastName ?? ""}?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        pending={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
