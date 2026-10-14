"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CircleAlert, CircleCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { subscribe } from "@/lib/actions/newsletter";
import { cn } from "@/lib/utils";

interface NewsletterCardProps {
  heading?: string;
  description?: string;
  className?: string;
}

/**
 * Newsletter panel.
 *
 * Uses a Server Action through `useActionState`, so it submits and validates
 * with or without JavaScript. The honeypot field below is invisible to people
 * but irresistible to bots.
 */
export function NewsletterCard({
  heading = "Get the next one in your inbox",
  description = "One email whenever I ship something worth writing about. No schedule, no spam.",
  className,
}: NewsletterCardProps) {
  const [state, formAction, pending] = useActionState(subscribe, null);

  return (
    <section className={cn("rounded-card bg-panel px-6 py-14 text-center md:py-16", className)}>
      <h2 className="font-serif text-2xl text-fg md:text-[1.75rem]">{heading}</h2>
      <p className="mx-auto mt-3 max-w-[360px] text-sm leading-relaxed text-muted">
        {description}
      </p>

      <form action={formAction} className="mx-auto mt-8 flex w-full max-w-[380px] flex-col gap-3">
        <div className="relative">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Mail
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint"
          />
          <input
            id="newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="You@gmail.com"
            aria-invalid={state?.ok === false || undefined}
            className={cn(
              "h-11 w-full rounded-button border border-line-strong bg-well pr-4 pl-10",
              "text-sm text-fg placeholder:text-faint",
              "transition-colors duration-200 ease-out-soft",
              "hover:border-accent/60 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none",
            )}
          />
        </div>

        {/* Honeypot — off-screen, unreachable by keyboard, ignored by people. */}
        <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="newsletter-company">Company</label>
          <input
            id="newsletter-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Button type="submit" loading={pending} fullWidth size="lg">
          Subscribe
        </Button>

        {/* Consent: says what the address is used for and links the policy,
            at the point of collection rather than buried elsewhere. */}
        <p className="text-xs leading-5 text-faint">
          One email when I publish — no spam, unsubscribe any time. Read the{" "}
          <Link
            href="/privacy"
            className="text-accent-text underline underline-offset-2 transition-colors hover:text-fg"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "mx-auto mt-4 flex max-w-[380px] items-center justify-center gap-2 text-xs",
          state?.ok ? "text-success" : "text-danger",
        )}
      >
        {state ? (
          <>
            {state.ok ? (
              <CircleCheck aria-hidden className="size-3.5 shrink-0" />
            ) : (
              <CircleAlert aria-hidden className="size-3.5 shrink-0" />
            )}
            <span>{state.message}</span>
          </>
        ) : null}
      </p>
    </section>
  );
}
