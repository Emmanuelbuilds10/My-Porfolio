"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CircleCheck, CircleAlert, Eye, Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { SegmentedControl } from "@/components/admin/SegmentedControl";
import { TagInput } from "@/components/admin/TagInput";
import { useToast } from "@/components/admin/Toast";
import { checkSlug, saveContent } from "@/lib/admin/actions/content";
import { createCategory } from "@/lib/admin/actions/categories";
import type { AdminContent, CategoryOption } from "@/lib/admin/data";
import type { ContentValues } from "@/lib/admin/schemas";
import { estimateReadTime } from "@/lib/format";
import type { ContentImage, ContentType, ProjectStatus, PublishStatus } from "@/lib/types";
import { slugify } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface ContentEditorProps {
  initial: AdminContent | null;
  categories: CategoryOption[];
  tagSuggestions: string[];
  techSuggestions: string[];
}

const AUTOSAVE_MS = 30_000;

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

const STATUS_OPTIONS: { value: PublishStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "live", label: "Live" },
  { value: "in-progress", label: "In progress" },
  { value: "archived", label: "Archived" },
];

/**
 * ONE editor for posts and projects. The type switcher at the top decides
 * whether the post-only (category, tags) or project-only (tech, links, status)
 * fields are shown; everything else is shared.
 */
export function ContentEditor({
  initial,
  categories: initialCategories,
  tagSuggestions,
  techSuggestions,
}: ContentEditorProps) {
  const toast = useToast();

  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [type, setType] = useState<ContentType>(initial?.type ?? "post");
  const [pendingType, setPendingType] = useState<ContentType | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  // `checked` remembers which slug the result belongs to, so availability can
  // be derived during render instead of being reset from an effect.
  const [checked, setChecked] = useState<{ slug: string; available: boolean } | null>(null);

  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? "");
  const [gallery, setGallery] = useState<ContentImage[]>(initial?.gallery ?? []);
  const [altText, setAltText] = useState(initial?.altText ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [techStack, setTechStack] = useState<string[]>(initial?.techStack ?? []);
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl ?? "");
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(
    initial?.projectStatus ?? "in-progress",
  );

  const [publishStatus, setPublishStatus] = useState<PublishStatus>(
    initial?.publishStatus ?? "draft",
  );
  const [publishedAt, setPublishedAt] = useState(toLocalInput(initial?.publishedAt ?? null));

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(initial ? new Date() : null);
  const [dirty, setDirty] = useState(false);

  const currentId = useRef<string | undefined>(initial?.id);
  const readTime = useMemo(() => estimateReadTime(body), [body]);
  const canPersist = title.trim().length > 0 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

  const slugValue = slug.trim();
  const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugValue);
  const slugState: "idle" | "checking" | "free" | "taken" = !slugValid
    ? "idle"
    : checked?.slug === slugValue
      ? checked.available
        ? "free"
        : "taken"
      : "checking";

  // Debounced uniqueness check (state is set from the timeout callback only).
  useEffect(() => {
    if (!slugValid) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const result = await checkSlug(slugValue, currentId.current);
      if (!cancelled) setChecked({ slug: slugValue, available: result.available });
    }, 450);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [slugValue, slugValid]);

  const persist = useCallback(
    async (status: PublishStatus, options?: { silent?: boolean }): Promise<boolean> => {
      if (!options?.silent) setSaving(true);
      setFieldErrors({});

      const payload: ContentValues = {
        id: currentId.current,
        type,
        title,
        slug,
        excerpt,
        body,
        coverImageUrl,
        gallery,
        altText,
        featured,
        categoryId: type === "post" && categoryId ? categoryId : null,
        tags: type === "post" ? tags : [],
        techStack: type === "project" ? techStack : [],
        liveUrl: type === "project" ? liveUrl : "",
        repoUrl: type === "project" ? repoUrl : "",
        projectStatus: type === "project" ? projectStatus : null,
        publishStatus: status,
        publishedAt: publishedAt || null,
      };

      const result = await saveContent(payload);
      if (!options?.silent) setSaving(false);

      if (!result.ok) {
        if (!options?.silent) {
          setFieldErrors(result.fieldErrors ?? {});
          toast.error(result.message);
        }
        return false;
      }

      if (result.id) currentId.current = result.id;
      setDirty(false);
      setSavedAt(new Date());
      if (!options?.silent) toast.success(result.message);

      // A brand-new item now has an id — move the URL onto the edit route.
      if (initial === null && result.id) {
        window.history.replaceState(null, "", `/admin/${result.id}/edit`);
      }
      return true;
    },
    [
      altText, body, categoryId, coverImageUrl, excerpt, featured, gallery, initial,
      liveUrl, projectStatus, publishedAt, repoUrl, slug, tags, techStack,
      title, toast, type,
    ],
  );

  // Autosave drafts every 30s (skipped for published items — those are manual).
  useEffect(() => {
    if (publishStatus === "published" || !canPersist) return;
    const timer = window.setInterval(() => {
      if (dirty) void persist(publishStatus, { silent: true });
    }, AUTOSAVE_MS);
    return () => window.clearInterval(timer);
  }, [canPersist, dirty, persist, publishStatus]);

  // Warn before losing unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  function touch() {
    setDirty(true);
  }

  async function applyType(next: ContentType) {
    setType(next);
    setPendingType(null);
    touch();
  }

  function requestType(next: ContentType) {
    if (next === type) return;
    if (initial && next !== initial.type) {
      setPendingType(next);
      return;
    }
    void applyType(next);
  }

  async function addCategory() {
    const name = newCategory.trim();
    if (!name) return;
    setCreatingCategory(true);
    const result = await createCategory({ name });
    setCreatingCategory(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    const created: CategoryOption = {
      id: result.id ?? crypto.randomUUID(),
      name,
      slug: slugify(name),
      postCount: 0,
    };
    setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setCategoryId(created.id);
    setNewCategory("");
    toast.success("Category created.");
  }

  const primaryLabel =
    publishStatus === "published" ? "Publish" : publishStatus === "scheduled" ? "Schedule" : "Save draft";

  return (
    <div className="pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl text-fg">
            {initial ? "Edit item" : "New item"}
          </h1>
          <p className="mt-1 text-sm text-faint">
            {initial ? `Updated ${new Date(initial.updatedAt).toLocaleString()}` : "Create a post or a project."}
          </p>
        </div>
        <SegmentedControl
          label="Content type"
          value={type}
          onChange={(value) => requestType(value as ContentType)}
          options={[
            { value: "post", label: "Post" },
            { value: "project", label: "Project" },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-6">
          <Field label="Title" error={fieldErrors.title}>
            <input
              value={title}
              onChange={(event) => {
                const next = event.target.value;
                setTitle(next);
                if (!slugTouched) setSlug(slugify(next));
                touch();
              }}
              placeholder="A clear, specific title"
              className={inputClass(fieldErrors.title)}
            />
          </Field>

          <Field
            label="Slug"
            error={fieldErrors.slug}
            hint={
              slugState === "taken"
                ? undefined
                : "Used in the public URL."
            }
            aside={
              slugState === "checking" ? (
                <span className="inline-flex items-center gap-1 text-xs text-faint">
                  <Loader2 aria-hidden className="size-3 animate-spin" /> checking
                </span>
              ) : slugState === "free" ? (
                <span className="inline-flex items-center gap-1 text-xs text-success">
                  <CircleCheck aria-hidden className="size-3" /> available
                </span>
              ) : slugState === "taken" ? (
                <span className="inline-flex items-center gap-1 text-xs text-danger">
                  <CircleAlert aria-hidden className="size-3" /> already used
                </span>
              ) : null
            }
          >
            <input
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value.toLowerCase());
                touch();
              }}
              onBlur={() => {
                if (!slug && title) setSlug(slugify(title));
              }}
              placeholder="auto-generated-from-the-title"
              className={inputClass(fieldErrors.slug)}
            />
          </Field>

          <Field
            label={type === "post" ? "Excerpt" : "Short description"}
            error={fieldErrors.excerpt}
            aside={<span className="text-xs text-faint">{excerpt.length}/320</span>}
          >
            <textarea
              value={excerpt}
              maxLength={320}
              onChange={(event) => {
                setExcerpt(event.target.value);
                touch();
              }}
              rows={3}
              className={cn(inputClass(fieldErrors.excerpt), "resize-y")}
            />
          </Field>

          <ImageUpload
            label="Cover image"
            value={coverImageUrl}
            onChange={(url) => {
              setCoverImageUrl(url);
              touch();
            }}
          />

          <Field label="Cover alt text" error={fieldErrors.altText}>
            <input
              value={altText}
              onChange={(event) => {
                setAltText(event.target.value);
                touch();
              }}
              placeholder="Describe the image for screen readers"
              className={inputClass(fieldErrors.altText)}
            />
          </Field>

          <GalleryUpload
            values={gallery}
            onChange={(next) => {
              setGallery(next);
              touch();
            }}
            hint="Shown as a grid under the body on the detail page. Drag to reorder."
          />

          <MarkdownEditor
            label="Body"
            value={body}
            onChange={(next) => {
              setBody(next);
              touch();
            }}
            placeholder="Write in markdown…"
          />

          {/* Conditional fields — animated in/out when the type switches. */}
          <div key={type} className="animate-field-in flex flex-col gap-6">
            {type === "post" ? (
              <>
                <Field label="Category" error={fieldErrors.categoryId}>
                  <select
                    value={categoryId}
                    onChange={(event) => {
                      setCategoryId(event.target.value);
                      touch();
                    }}
                    className={inputClass()}
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <div>
                  <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
                    New category
                  </span>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      placeholder="Add a category inline"
                      className={cn(inputClass(), "flex-1")}
                    />
                    <Button
                      variant="secondary"
                      onClick={addCategory}
                      loading={creatingCategory}
                      disabled={!newCategory.trim()}
                    >
                      <Plus aria-hidden className="size-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <TagInput
                  label="Tags"
                  values={tags}
                  onChange={(next) => {
                    setTags(next);
                    touch();
                  }}
                  suggestions={tagSuggestions}
                  placeholder="nextjs, performance…"
                />
              </>
            ) : (
              <>
                <TagInput
                  label="Tech stack"
                  values={techStack}
                  onChange={(next) => {
                    setTechStack(next);
                    touch();
                  }}
                  suggestions={techSuggestions}
                  placeholder="Next.js, Postgres…"
                />

                <Field label="Live URL" error={fieldErrors.liveUrl}>
                  <input
                    value={liveUrl}
                    onChange={(event) => {
                      setLiveUrl(event.target.value);
                      touch();
                    }}
                    placeholder="https://example.com"
                    className={inputClass(fieldErrors.liveUrl)}
                  />
                </Field>

                <Field label="Repository URL" error={fieldErrors.repoUrl}>
                  <input
                    value={repoUrl}
                    onChange={(event) => {
                      setRepoUrl(event.target.value);
                      touch();
                    }}
                    placeholder="https://github.com/you/project"
                    className={inputClass(fieldErrors.repoUrl)}
                  />
                </Field>

                <Field label="Project status">
                  <select
                    value={projectStatus}
                    onChange={(event) => {
                      setProjectStatus(event.target.value as ProjectStatus);
                      touch();
                    }}
                    className={inputClass()}
                  >
                    {PROJECT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-card border border-line bg-panel/40 p-5">
            <p className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              Publishing
            </p>
            <select
              value={publishStatus}
              onChange={(event) => {
                setPublishStatus(event.target.value as PublishStatus);
                touch();
              }}
              className={cn(inputClass(), "mt-3")}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {publishStatus === "scheduled" ? (
              <label className="mt-4 flex flex-col gap-2">
                <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
                  Publish at
                </span>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(event) => {
                    setPublishedAt(event.target.value);
                    touch();
                  }}
                  className={inputClass(fieldErrors.publishedAt)}
                />
                {fieldErrors.publishedAt ? (
                  <span className="text-xs text-danger">{fieldErrors.publishedAt}</span>
                ) : null}
              </label>
            ) : null}

            <label className="mt-4 flex items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => {
                  setFeatured(event.target.checked);
                  touch();
                }}
                className="mt-0.5 size-4 accent-[var(--color-accent)]"
              />
              <span>
                {type === "project" ? "Show on landing page" : "Featured"}
                {type === "project" ? (
                  <span className="mt-0.5 block text-xs text-faint">
                    Adds this project to Selected Work on the home page.
                  </span>
                ) : null}
              </span>
            </label>

            <div className="mt-5 border-t border-line pt-4">
              <p className="text-xs text-faint">
                Read time: <span className="text-fg">{readTime} min</span>
              </p>
              <p className="mt-2 text-xs text-faint" aria-live="polite">
                {saving ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Loader2 aria-hidden className="size-3 animate-spin" /> Saving…
                  </span>
                ) : dirty ? (
                  "Unsaved changes"
                ) : savedAt ? (
                  `Saved ${savedAt.toLocaleTimeString()}`
                ) : null}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-end gap-3 px-4 py-3 md:px-8">
          <Button
            variant="secondary"
            onClick={() => {
              if (!currentId.current) {
                toast.error("Save the draft first, then preview it.");
                return;
              }
              window.open(`/admin/${currentId.current}/preview`, "_blank");
            }}
          >
            <Eye aria-hidden className="size-4" />
            Preview
          </Button>
          <Button
            onClick={() => void persist(publishStatus)}
            loading={saving}
            disabled={!canPersist || slugState === "taken"}
          >
            <Save aria-hidden className="size-4" />
            {primaryLabel}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={pendingType !== null}
        title={`Switch to ${pendingType === "project" ? "Project" : "Post"}?`}
        description="The fields that belong to the other type will be cleared when you save."
        confirmLabel="Switch type"
        onCancel={() => setPendingType(null)}
        onConfirm={() => pendingType && applyType(pendingType)}
      />
    </div>
  );
}

function inputClass(error?: string) {
  return cn(
    "w-full rounded-button border bg-well px-4 py-2.5 text-sm text-fg outline-none transition-colors",
    "placeholder:text-faint focus:border-accent",
    error ? "border-danger" : "border-line-strong",
  );
}

function Field({
  label,
  error,
  hint,
  aside,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
          {label}
        </span>
        {aside}
      </div>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-faint">{hint}</p>
      ) : null}
    </div>
  );
}
