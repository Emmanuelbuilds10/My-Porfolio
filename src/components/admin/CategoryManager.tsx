"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { DataTable, rowBase, tdBase } from "@/components/admin/DataTable";
import { useToast } from "@/components/admin/Toast";
import {
  createCategory,
  deleteCategory,
  renameCategory,
} from "@/lib/admin/actions/categories";
import type { CategoryOption } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

export function CategoryManager({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const toast = useToast();
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<CategoryOption | null>(null);
  const [reassignTo, setReassignTo] = useState("");

  const inputClass =
    "w-full rounded-button border border-line-strong bg-well px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";

  async function add() {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    const result = await createCategory({ name });
    setCreating(false);
    if (result.ok) {
      toast.success(result.message);
      setNewName("");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function save(category: CategoryOption) {
    const name = (drafts[category.id] ?? category.name).trim();
    if (name === category.name) return;
    setBusyId(category.id);
    const result = await renameCategory(category.id, name);
    setBusyId(null);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    const result = await deleteCategory(deleting.id, reassignTo || null);
    setBusyId(null);
    if (result.ok) {
      toast.success(result.message);
      setDeleting(null);
      setReassignTo("");
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-[240px] flex-1 flex-col gap-2">
          <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
            New category
          </span>
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && void add()}
            placeholder="e.g. Performance"
            className={inputClass}
          />
        </label>
        <Button onClick={add} loading={creating} disabled={!newName.trim()}>
          <Plus aria-hidden className="size-4" />
          Add category
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-card border border-line bg-panel/40 px-5 py-8 text-center text-sm text-muted">
          No categories yet. Add one above.
        </p>
      ) : (
        <DataTable columns={["Name", "Slug", "Posts", "Actions"]}>
          {categories.map((category) => (
            <tr key={category.id} className={rowBase}>
              <td className={tdBase}>
                <input
                  value={drafts[category.id] ?? category.name}
                  onChange={(event) =>
                    setDrafts((prev) => ({ ...prev, [category.id]: event.target.value }))
                  }
                  onBlur={() => void save(category)}
                  className={inputClass}
                />
              </td>
              <td className={cn(tdBase, "font-mono text-xs text-faint")}>{category.slug}</td>
              <td className={tdBase}>{category.postCount}</td>
              <td className={tdBase}>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => void save(category)}
                    loading={busyId === category.id}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setDeleting(category);
                      setReassignTo("");
                    }}
                  >
                    <Trash2 aria-hidden className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete “${deleting?.name ?? ""}”?`}
        description={
          deleting && deleting.postCount > 0
            ? `This category is used by ${deleting.postCount} item(s). Choose where to move them, then delete.`
            : "This category is not used by any content yet."
        }
        pending={busyId === deleting?.id}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
      />

      {deleting && deleting.postCount > 0 ? (
        <label className="flex flex-col gap-2">
          <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
            Move posts to
          </span>
          <select
            value={reassignTo}
            onChange={(event) => setReassignTo(event.target.value)}
            className={inputClass}
          >
            <option value="">Choose a category…</option>
            {categories
              .filter((category) => category.id !== deleting.id)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
