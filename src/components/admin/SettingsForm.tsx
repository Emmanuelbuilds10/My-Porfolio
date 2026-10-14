"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { useToast } from "@/components/admin/Toast";
import { saveSettings } from "@/lib/admin/actions/settings";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-button border border-line-strong bg-well px-4 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-faint focus:border-accent";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const router = useRouter();
  const toast = useToast();

  const [name, setName] = useState(settings?.name ?? "");
  const [role, setRole] = useState(settings?.role ?? "");
  const [location, setLocation] = useState(settings?.location ?? "");
  const [email, setEmail] = useState(settings?.email ?? "");
  const [twitterUrl, setTwitterUrl] = useState(settings?.twitterUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(settings?.githubUrl ?? "");
  const [dribbbleUrl, setDribbbleUrl] = useState(settings?.dribbbleUrl ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(settings?.linkedinUrl ?? "");
  const [avatarUrl, setAvatarUrl] = useState(settings?.avatarUrl ?? "");
  const [bio, setBio] = useState((settings?.bioParagraphs ?? []).join("\n\n"));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit() {
    setSaving(true);
    setErrors({});
    const result = await saveSettings({
      name,
      role,
      location,
      email,
      bio,
      avatarUrl,
      twitterUrl,
      githubUrl,
      dribbbleUrl,
      linkedinUrl,
    });
    setSaving(false);
    if (result.ok) {
      toast.success(result.message);
      router.refresh();
    } else {
      setErrors(result.fieldErrors ?? {});
      toast.error(result.message);
    }
  }

  return (
    <div className="flex max-w-[820px] flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Labeled label="Name" error={errors.name}>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Labeled>
        <Labeled label="Role" error={errors.role}>
          <input value={role} onChange={(e) => setRole(e.target.value)} className={inputClass} />
        </Labeled>
        <Labeled label="Location" error={errors.location}>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={inputClass}
          />
        </Labeled>
        <Labeled label="Email" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Labeled>
        <Labeled label="Twitter / X URL" error={errors.twitterUrl}>
          <input
            value={twitterUrl}
            onChange={(e) => setTwitterUrl(e.target.value)}
            placeholder="https://twitter.com/you"
            className={inputClass}
          />
        </Labeled>
        <Labeled label="GitHub URL" error={errors.githubUrl}>
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/you"
            className={inputClass}
          />
        </Labeled>
        <Labeled label="Dribbble URL" error={errors.dribbbleUrl}>
          <input
            value={dribbbleUrl}
            onChange={(e) => setDribbbleUrl(e.target.value)}
            placeholder="https://dribbble.com/you"
            className={inputClass}
          />
        </Labeled>
        <Labeled label="LinkedIn URL" error={errors.linkedinUrl}>
          <input
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/you"
            className={inputClass}
          />
        </Labeled>
      </div>

      <ImageUpload label="Avatar" value={avatarUrl} onChange={setAvatarUrl} />

      <MarkdownEditor
        label="Bio"
        value={bio}
        onChange={setBio}
        minHeightClassName="min-h-[220px]"
      />

      <div className="flex justify-end">
        <Button onClick={submit} loading={saving}>
          Save settings
        </Button>
      </div>
    </div>
  );
}

function Labeled({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
        {label}
      </span>
      {children}
      {error ? <span className={cn("text-xs text-danger")}>{error}</span> : null}
    </label>
  );
}
