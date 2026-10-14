"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { TwitterIcon } from "@/components/icons";
import { Button, ButtonLink } from "@/components/ui/Button";

/**
 * The action row under the author card on a post or project page.
 *
 * Both pages show the same pair, in the same secondary small style: "Contact on
 * X" (opens X's DM composer for the profile saved in Settings) and "Copy link".
 */
export function ContactOnXButton({ href }: { href: string }) {
  if (!href) return null;

  return (
    <ButtonLink
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      size="sm"
      variant="secondary"
    >
      <TwitterIcon className="size-3.5" />
      Contact on X
    </ButtonLink>
  );
}

/** Copies the current URL to the clipboard, confirming inline for a moment. */
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
