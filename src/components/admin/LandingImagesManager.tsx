"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useToast } from "@/components/admin/Toast";
import {
  deleteLandingImage,
  reorderLandingImages,
  saveLandingImage,
} from "@/lib/admin/actions/landing-images";
import type { AdminLandingImage } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-button border border-line-strong bg-well px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent";

interface NewImage {
  imageUrl: string;
  alt: string;
}

export function LandingImagesManager({ images }: { images: AdminLandingImage[] }) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState(images);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<NewImage>({ imageUrl: "", alt: "" });
  const [deleting, setDeleting] = useState<AdminLandingImage | null>(null);
  const dragIndex = useRef<number | null>(null);

  async function persistOrder(next: AdminLandingImage[]) {
    const result = await reorderLandingImages(next.map((item) => item.id));
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

  async function saveAlt(item: AdminLandingImage, alt: string) {
    setBusyId(item.id);
    const result = await saveLandingImage({
      id: item.id,
      imageUrl: item.imageUrl,
      alt,
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
    if (!newImage.imageUrl.trim()) return;
    setBusyId("new");
    const result = await saveLandingImage({
      imageUrl: newImage.imageUrl,
      alt: newImage.alt,
    });
    setBusyId(null);
    if (result.ok) {
      toast.success(result.message);
      setNewImage({ imageUrl: "", alt: "" });
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setBusyId(deleting.id);
    const result = await deleteLandingImage(deleting.id);
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
            className="flex flex-wrap items-center gap-4 rounded-card border border-line bg-panel/40 p-4"
          >
            <span className="cursor-grab text-faint" title="Drag to reorder">
              <GripVertical aria-hidden className="size-4" />
            </span>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt=""
              className="h-14 w-24 shrink-0 rounded-media object-cover ring-1 ring-line"
            />

            <div className="min-w-[200px] flex-1">
              <input
                defaultValue={item.alt}
                placeholder="Alt text (screen readers)"
                className={inputClass}
                onBlur={(event) => {
                  if (event.target.value !== item.alt) {
                    void saveAlt(item, event.target.value);
                  }
                }}
              />
            </div>

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
          Add an image to the carousel
        </p>
        <div className="mt-3 grid gap-4 sm:max-w-[480px]">
          <ImageUpload
            label="Marquee image"
            value={newImage.imageUrl}
            onChange={(url) => setNewImage((prev) => ({ ...prev, imageUrl: url }))}
            hint="Landscape crops best — the strip shows each tile at roughly 8:5."
          />
          <div className="flex items-center gap-3">
            <input
              value={newImage.alt}
              onChange={(event) => setNewImage((prev) => ({ ...prev, alt: event.target.value }))}
              placeholder="Alt text (optional — decorative if empty)"
              className={cn(inputClass, "flex-1")}
            />
            <Button
              onClick={add}
              loading={busyId === "new"}
              disabled={!newImage.imageUrl.trim()}
            >
              <Plus aria-hidden className="size-4" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title="Remove this image from the carousel?"
        pending={busyId === deleting?.id}
        onCancel={() => setDeleting(null)}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
