"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShareButtonsProps {
  title: string;
}

/**
 * Share action shown under the author card on post pages, paired with
 * `CopyLinkButton`. Uses the Web Share API where available; when the user
 * dismisses the sheet the request just cancels — the copy button beside it
 * already covers the manual-copy path.
 */
export function ShareButtons({ title }: ShareButtonsProps) {
  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch {
        // User dismissed the sheet — nothing to do.
      }
    }
  }

  return (
    <>
      <Button size="sm" variant="secondary" onClick={share}>
        <Share2 aria-hidden className="size-3.5" />
        Share
      </Button>
      <CopyLinkButton />
    </>
  );
}

/**
 * Stand-alone copy-link button. Used on its own on the project detail page
 * (where the primary action is "Contact on X") and inside the paired
 * `ShareButtons` row elsewhere.
 */
export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context / permissions) — nothing to do.
    }
  }

  return (
    <Button size="sm" variant="secondary" onClick={copyLink} aria-live="polite">
      {copied ? (
        <Check aria-hidden className="size-3.5" />
      ) : (
        <Copy aria-hidden className="size-3.5" />
      )}
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}
