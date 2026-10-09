"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
/** The single public bucket; folders keep covers and avatars apart. */
const BUCKET = "covers";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  className?: string;
}

/**
 * Drag-and-drop or click-to-upload image field. Files go straight to the
 * `covers` Storage bucket using the signed-in admin's session (the bucket's
 * RLS policies require `is_admin()`), so no service key is involved.
 */
export function ImageUpload({ label, value, onChange, hint, className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading">("idle");
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Images must be 5MB or smaller.");
      return;
    }

    setStatus("uploading");
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${label.toLowerCase().replace(/\s+/g, "-")}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className={className}>
      <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
        {label}
      </span>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void upload(file);
        }}
        className={cn(
          "relative mt-2 overflow-hidden rounded-card border border-dashed",
          dragging ? "border-accent bg-accent-soft" : "border-line-strong bg-well",
        )}
      >
        {value ? (
          <div className="relative">
            <div className="relative aspect-[16/9] w-full">
              <Image src={value} alt="" fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line bg-panel/60 px-3 py-2">
              <span className="truncate text-xs text-faint">{value}</span>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
                  Replace
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onChange("")}>
                  <X aria-hidden className="size-3.5" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={status === "uploading"}
            className="flex w-full flex-col items-center gap-2 px-6 py-10 text-center"
          >
            {status === "uploading" ? (
              <Loader2 aria-hidden className="size-5 animate-spin text-accent" />
            ) : (
              <ImagePlus aria-hidden className="size-5 text-accent" />
            )}
            <span className="text-sm text-fg">
              {status === "uploading" ? "Uploading…" : "Drag an image here, or click to browse"}
            </span>
            <span className="text-xs text-faint">PNG, JPG, WebP or GIF · up to 5MB</span>
          </button>
        )}

        {status === "uploading" ? (
          <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-accent-soft">
            <div className="h-full w-1/2 animate-pulse bg-accent" />
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file);
          event.target.value = "";
        }}
      />

      {hint ? <p className="mt-2 text-xs text-faint">{hint}</p> : null}
      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-faint">
        <Upload aria-hidden className="size-3" />
        Uploaded to Supabase Storage
      </p>
    </div>
  );
}
