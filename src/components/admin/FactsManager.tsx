"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import { deleteFact, reorderFacts, saveFact } from "@/lib/admin/actions/facts";
import { factIconKeys } from "@/components/content/FactCard";
import type { Fact } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DraftFact {
  id: string;
  icon: string;
  label: string;
  value: string;
}

const inputClass =
  "w-full rounded-button border border-line-strong bg-well px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";

export function FactsManager({ facts }: { facts: Fact[] }) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState<DraftFact[]>(
    facts.map((fact) => ({ id: fact.id, icon: fact.icon, label: fact.label, value: fact.value })),
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newFact, setNewFact] = useState<DraftFact>({
    id: "",
    icon: factIconKeys[0] ?? "sparkles",
    label: "",
    value: "",
  });
  const [deleting, setDeleting] = useState<DraftFact | null>(null);
  const dragIndex = useRef<number | null>(null);

  function update(index: number, patch: Partial<DraftFact>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function persistOrder(next: DraftFact[]) {
    const result = await reorderFacts(next.map((item) => item.id).filter(Boolean));
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    void persistOrder(next);
  }

  async function save(item: DraftFact) {
    setBusyId(item.id);
    const result = await saveFact({
      id: item.id,
      icon: item.icon,
      label: item.label,
      value: item.value,
    });
    setBusyId(null);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function add() {
    if (!newFact.label.trim() || !newFact.value.trim()) return;
    setBusyId("new");
    const result = await saveFact({
      icon: newFact.icon,
      label: newFact.label,
      value: newFact.value,
    });
    setBusyId(null);
    if (result.ok) {
      toast.success(result.message);
      setNewFact({ id: "", icon: factIconKeys[0] ?? "sparkles", label: "", value: "" });
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    const result = await deleteFact(deleting.id);
    setBusyId(null);
    if (result.ok) {
      toast.success(result.message);
      setItems((prev) => prev.filter((item) => item.id !== deleting.id));
      setDeleting(null);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => (dragIndex.current = index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              const from = dragIndex.current;
              dragIndex.current = null;
              if (from === null || from === index) return;
              const next = [...items];
              const [moved] = next.splice(from, 1);
              next.splice(index, 0, moved);
              setItems(next);
              void persistOrder(next);
            }}
            className="flex flex-wrap items-center gap-3 rounded-card border border-line bg-panel/40 p-4"
          >
            <span className="cursor-grab text-faint" title="Drag to reorder">
              <GripVertical aria-hidden className="size-4" />
            </span>

            <select
              value={item.icon}
              onChange={(event) => update(index, { icon: event.target.value })}
              className={cn(inputClass, "w-[150px]")}
              aria-label="Icon"
            >
              {factIconKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            <input
              value={item.label}
              onChange={(event) => update(index, { label: event.target.value })}
              placeholder="Label"
              className={cn(inputClass, "w-[160px]")}
            />
            <input
              value={item.value}
              onChange={(event) => update(index, { value: event.target.value })}
              placeholder="Value"
              className={cn(inputClass, "min-w-[180px] flex-1")}
            />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="grid size-8 place-items-center rounded-button text-muted hover:bg-accent-soft hover:text-accent disabled:opacity-40"
              >
                <ArrowUp aria-hidden className="size-3.5" />
                <span className="sr-only">Move up</span>
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="grid size-8 place-items-center rounded-button text-muted hover:bg-accent-soft hover:text-accent disabled:opacity-40"
              >
                <ArrowDown aria-hidden className="size-3.5" />
                <span className="sr-only">Move down</span>
              </button>
              <Button size="sm" variant="secondary" onClick={() => void save(item)} loading={busyId === item.id}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDeleting(item)}>
                <Trash2 aria-hidden className="size-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="rounded-card border border-line bg-panel/40 p-4">
        <p className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
          Add a fact
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={newFact.icon}
            onChange={(event) => setNewFact({ ...newFact, icon: event.target.value })}
            className={cn(inputClass, "w-[150px]")}
            aria-label="Icon"
          >
            {factIconKeys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <input
            value={newFact.label}
            onChange={(event) => setNewFact({ ...newFact, label: event.target.value })}
            placeholder="Label"
            className={cn(inputClass, "w-[160px]")}
          />
          <input
            value={newFact.value}
            onChange={(event) => setNewFact({ ...newFact, value: event.target.value })}
            placeholder="Value"
            className={cn(inputClass, "min-w-[180px] flex-1")}
          />
          <Button
            onClick={add}
            loading={busyId === "new"}
            disabled={!newFact.label.trim() || !newFact.value.trim()}
          >
            <Plus aria-hidden className="size-4" />
            Add
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title={`Delete “${deleting?.label ?? ""}”?`}
        pending={busyId === deleting?.id}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
