"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, rowBase, tdBase } from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/Toast";
import { exportSubscribers, removeSubscriber } from "@/lib/admin/actions/subscribers";
import type { AdminSubscriber } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

interface SubscribersTableProps {
  rows: AdminSubscriber[];
  q: string;
  page: number;
  totalPages: number;
}

export function SubscribersTable({ rows, q, page, totalPages }: SubscribersTableProps) {
  const router = useRouter();
  const toast = useToast();
  const [removing, setRemoving] = useState<AdminSubscriber | null>(null);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);

  function hrefFor(target: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `/admin/subscribers?${query}` : "/admin/subscribers";
  }

  async function confirmRemove() {
    if (!removing) return;
    setBusy(true);
    const result = await removeSubscriber(removing.id);
    setBusy(false);
    if (result.ok) {
      toast.success(result.message);
      setRemoving(null);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function download() {
    setExporting(true);
    const result = await exportSubscribers();
    setExporting(false);
    if (!result.ok || !result.csv) {
      toast.error(result.message);
      return;
    }
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = result.filename ?? "subscribers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success(result.message);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form
          action="/admin/subscribers"
          method="get"
          role="search"
          className="flex w-full gap-2 sm:w-auto"
        >
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search by email"
            className="h-10 w-full rounded-button border border-line-strong bg-well px-4 text-sm text-fg outline-none transition-colors focus:border-accent sm:w-[240px]"
          />
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>

        <Button variant="secondary" onClick={download} loading={exporting} disabled={rows.length === 0}>
          <Download aria-hidden className="size-4" />
          Export CSV
        </Button>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-card border border-line bg-panel/40 px-5 py-10 text-center text-sm text-muted">
          {q ? "No subscribers match that search." : "No subscribers yet."}
        </p>
      ) : (
        <DataTable columns={["Email", "Subscribed", "Actions"]}>
          {rows.map((row) => (
            <tr key={row.id} className={rowBase}>
              <td className={cn(tdBase, "text-fg")}>{row.email}</td>
              <td className={tdBase}>{new Date(row.createdAt).toLocaleString()}</td>
              <td className={tdBase}>
                <Button size="sm" variant="ghost" onClick={() => setRemoving(row)}>
                  <Trash2 aria-hidden className="size-3.5" />
                  Remove
                </Button>
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
                  ? "bg-accent-fill text-on-accent"
                  : "text-muted hover:bg-accent-soft hover:text-accent-text",
              )}
            >
              {target}
            </Link>
          ))}
        </nav>
      ) : null}

      <ConfirmDialog
        open={removing !== null}
        title={`Remove ${removing?.email ?? ""}?`}
        description="They will no longer receive the newsletter."
        confirmLabel="Remove"
        pending={busy}
        onCancel={() => setRemoving(null)}
        onConfirm={() => void confirmRemove()}
      />
    </div>
  );
}
