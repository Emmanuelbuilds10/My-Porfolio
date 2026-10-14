"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { uploadImage } from "@/lib/supabase/upload";
import type { ContentImage } from "@/lib/types";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-button border border-line-strong bg-well px-3 py-2 text-xs text-fg outline-none transition-colors placeholder:text-faint focus:border-accent";

interface GalleryUploadProps {
  values: ContentImage[];
  onChange: (next: ContentImage[]) => void;
  label?: string;
  hint?: string;
}

/**
 * The extra-image field on the content editor: a list of uploaded images with
 * per-image alt text, manual ordering and removal, plus a multi-file picker and
 * drag-and-drop target.
 *
 * Fully controlled — the editor owns the array, this only reports edits. That
 * keeps the gallery serialising alongside the other fields in one save payload.
 * Thumbnails use a plain `<img>` rather than `next/image`: an admin can paste
 * any URL, and a host outside `next.config.ts`'s allow-list would otherwise
 * crash the render instead of showing the picture.
 */
export function GalleryUpload({ values, onChange, label = "Gallery", hint }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function addFiles(files: File[]) {
    if (files.length === 0) return;
    setError(null);
    setUploading((count) => count + files.length);

    const added: ContentImage[] = [];
    for (const file of files) {
      const result = await uploadImage(file, "gallery");
      if (result.ok) added.push({ url: result.url, alt: "" });
      else setError(result.message);
    }

    setUploading((count) => Math.max(0, count - files.length));
    if (added.length > 0) onChange([...values, ...added]);
  }

  function patch(index: number, next: Partial<ContentImage>) {
    onChange(values.map((image, i) => (i === index ? { ...image, ...next } : image)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
          {label}
        </span>
        <span className="text-xs text-faint">{values.length}/12</span>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void addFiles(Array.from(event.dataTransfer.files ?? []));
        }}
        className={cn(
          "mt-2 overflow-hidden rounded-card border border-dashed transition-colors",
          dragging ? "border-accent bg-accent-soft" : "border-line-strong bg-well",
        )}
      >
        {values.length > 0 ? (
          <ul className="divide-y divide-line">
            {values.map((image, index) => (
              <li key={`${image.url}-${index}`} className="flex items-start gap-3 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt=""
                  className="h-14 w-24 shrink-0 rounded-media object-cover ring-1 ring-line"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <input
                    value={image.alt}
                    onChange={(event) => patch(index, { alt: event.target.value })}
                    placeholder="Alt text (screen readers)"
                    className={inputClass}
                  />
                  <span className="truncate text-[11px] text-faint" title={image.url}>
                    {image.url}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="grid size-8 place-items-center rounded-button text-muted transition-colors hover:bg-accent-soft hover:text-accent-text disabled:opacity-40"
                  >
                    <ArrowUp aria-hidden className="size-3.5" />
                    <span className="sr-only">Move image up</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === values.length - 1}
                    className="grid size-8 place-items-center rounded-button text-muted transition-colors hover:bg-accent-soft hover:text-accent-text disabled:opacity-40"
                  >
                    <ArrowDown aria-hidden className="size-3.5" />
                    <span className="sr-only">Move image down</span>
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onChange(values.filter((_, i) => i !== index))}
                  >
                    <Trash2 aria-hidden className="size-3.5" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading > 0 || values.length >= 12}
          className={cn(
            "flex w-full flex-col items-center gap-2 px-6 text-center disabled:opacity-60",
            values.length > 0 ? "py-5" : "py-8",
          )}
        >
          {uploading > 0 ? (
            <Loader2 aria-hidden className="size-5 animate-spin text-accent-text" />
          ) : (
            <ImagePlus aria-hidden className="size-5 text-accent-text" />
          )}
          <span className="text-sm text-fg">
            {uploading > 0
              ? `Uploading ${uploading}…`
              : values.length > 0
                ? "Add more images"
                : "Drag images here, or click to browse"}
          </span>
          <span className="text-xs text-faint">
            {values.length >= 12
              ? "Gallery is full — remove one to add another"
              : "Select several at once · PNG, JPG, WebP or GIF · up to 5MB each"}
          </span>
        </button>

        {uploading > 0 ? (
          <div className="h-0.5 overflow-hidden bg-accent-soft">
            <div className="h-full w-1/2 animate-pulse bg-accent" />
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) void addFiles(files);
          event.target.value = "";
        }}
      />

      {hint ? <p className="mt-2 text-xs text-faint">{hint}</p> : null}
      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
