"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { Markdown } from "@/components/content/Markdown";
import { SegmentedControl } from "@/components/admin/SegmentedControl";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const BUCKET = "covers";

interface MarkdownEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeightClassName?: string;
}

/**
 * Markdown editor: toolbar + live preview that uses the exact same renderer
 * and `.prose-post` styles as the public post page (imported `Markdown`).
 * Split view on desktop, Write/Preview tabs on mobile.
 */
export function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder,
  minHeightClassName = "min-h-[320px]",
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mobileView, setMobileView] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function surround(before: string, after = before, placeholderText = "text") {
    const element = textareaRef.current;
    if (!element) return;
    const { selectionStart, selectionEnd } = element;
    const selected = value.slice(selectionStart, selectionEnd) || placeholderText;
    const next = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
    onChange(next);
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(
        selectionStart + before.length,
        selectionStart + before.length + selected.length,
      );
    });
  }

  function prefixLines(prefix: string) {
    const element = textareaRef.current;
    if (!element) return;
    const { selectionStart, selectionEnd } = element;
    const lineStart = value.lastIndexOf("\n", Math.max(0, selectionStart - 1)) + 1;
    const foundEnd = value.indexOf("\n", selectionEnd);
    const lineEnd = foundEnd === -1 ? value.length : foundEnd;
    const block = value
      .slice(lineStart, lineEnd)
      .split("\n")
      .map((line) => `${prefix}${line}`)
      .join("\n");
    onChange(value.slice(0, lineStart) + block + value.slice(lineEnd));
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(lineStart, lineStart + block.length);
    });
  }

  function insertAtCursor(snippet: string) {
    const element = textareaRef.current;
    const start = element?.selectionStart ?? value.length;
    const next =
      value.slice(0, start) + snippet + value.slice(element?.selectionEnd ?? value.length);
    onChange(next);
    requestAnimationFrame(() => {
      element?.focus();
      element?.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  }

  async function uploadAndInsert(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Only images can be inserted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Images must be 5MB or smaller.");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `body/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      insertAtCursor(`\n![${file.name.replace(/\.[^.]+$/, "")}](${data.publicUrl})\n`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const toolbar = (
    <div className="flex flex-wrap items-center gap-1 rounded-t-button border border-b-0 border-line-strong bg-well px-2 py-1.5">
      <ToolButton label="Bold" icon={Bold} onClick={() => surround("**")} />
      <ToolButton label="Italic" icon={Italic} onClick={() => surround("*")} />
      <ToolButton label="Heading 2" icon={Heading2} onClick={() => prefixLines("## ")} />
      <ToolButton label="Heading 3" icon={Heading3} onClick={() => prefixLines("### ")} />
      <ToolButton
        label="Link"
        icon={Link2}
        onClick={() => surround("[", "](https://)", "link text")}
      />
      <ToolButton label="Quote" icon={Quote} onClick={() => prefixLines("> ")} />
      <ToolButton label="Inline code" icon={Code} onClick={() => surround("`", "`", "code")} />
      <ToolButton label="Bulleted list" icon={List} onClick={() => prefixLines("- ")} />
      <ToolButton label="Numbered list" icon={ListOrdered} onClick={() => prefixLines("1. ")} />
      <button
        type="button"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = () => {
            const file = input.files?.[0];
            if (file) void uploadAndInsert(file);
          };
          input.click();
        }}
        title="Insert image"
        className="grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-accent"
      >
        <ImagePlus aria-hidden className="size-4" />
        <span className="sr-only">Insert image</span>
      </button>
      {uploading ? <span className="ml-1 text-xs text-faint">Uploading…</span> : null}
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
          {label}
        </span>
        <SegmentedControl
          className="lg:hidden"
          label="Editor view"
          value={mobileView}
          onChange={(next) => setMobileView(next as "write" | "preview")}
          options={[
            { value: "write", label: "Write" },
            { value: "preview", label: "Preview" },
          ]}
        />
      </div>

      <div className="mt-2 grid gap-4 lg:grid-cols-2">
        <div className={cn(mobileView === "preview" && "hidden lg:block")}>
          {toolbar}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onPaste={(event) => {
              const file = Array.from(event.clipboardData.files)[0];
              if (file?.type.startsWith("image/")) {
                event.preventDefault();
                void uploadAndInsert(file);
              }
            }}
            onDrop={(event) => {
              const file = event.dataTransfer.files?.[0];
              if (file?.type.startsWith("image/")) {
                event.preventDefault();
                void uploadAndInsert(file);
              }
            }}
            placeholder={placeholder}
            spellCheck={false}
            className={cn(
              "w-full resize-y rounded-b-button border border-line-strong bg-well px-4 py-3",
              "font-mono text-sm leading-relaxed text-fg outline-none",
              "focus:border-accent",
              minHeightClassName,
            )}
          />
        </div>

        <div className={cn(mobileView === "write" && "hidden lg:block")}>
          <div className="h-full rounded-card border border-line bg-well/60 px-5 py-4">
            {value.trim() ? (
              <Markdown content={value} />
            ) : (
              <p className="text-sm text-faint">Nothing to preview yet.</p>
            )}
          </div>
        </div>
      </div>

      {error ? <p className="mt-2 text-xs text-danger">{error}</p> : null}
      <p className="mt-2 text-xs text-faint">
        Markdown · paste or drop an image to upload and insert it.
      </p>
    </div>
  );
}

function ToolButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof Bold;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-accent-soft hover:text-accent"
    >
      <Icon aria-hidden className="size-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}
