"use client";

import { useActionState } from "react";
import { CircleAlert, CircleCheck, Mail, Phone, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { sendMessage } from "@/lib/actions/contact";
import { contactDetails, site } from "@/lib/site";
import { cn } from "@/lib/utils";

const DETAIL_ICONS = { mail: Mail, phone: Phone } as const;

const FIELD =
  "h-11 w-full rounded-button border border-line-strong bg-well px-4 text-sm text-fg placeholder:text-faint " +
  "transition-colors duration-200 ease-out-soft " +
  "hover:border-accent/60 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none";

const LABEL = "mb-2 block text-xs font-medium text-muted";

/**
 * Landing contact panel: the pitch and the two quick details on the left, the
 * form on the right. Uses a Server Action through `useActionState`, so it
 * submits and validates with or without JavaScript.
 */
export function ContactSection() {
  const [state, formAction, pending] = useActionState(sendMessage, null);

  return (
    <section id="contact" className="mt-section scroll-mt-24">
      <Container>
        <span aria-hidden className="animate-float mb-8 block text-4xl md:text-5xl">
          😎
        </span>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---- Pitch + quick details ---- */}
          <div className="max-w-[520px]">
            <Eyebrow>{site.contactEyebrow}</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.12] text-fg">
              {site.contactTitle}
            </h2>
            <p className="mt-5 text-[15px] leading-7 text-muted">{site.contactBody}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {contactDetails.map((detail) => {
                const Icon = DETAIL_ICONS[detail.icon];
                return (
                  <div key={detail.label} className="rounded-card border border-line bg-veil p-5">
                    <span className="flex items-center gap-2 text-xs font-medium tracking-[0.1em] text-faint uppercase">
                      <Icon aria-hidden className="size-4 text-accent" />
                      {detail.label}
                    </span>
                    <dd className="mt-2 text-sm text-fg">
                      <a href={detail.href} className="transition-colors hover:text-accent">
                        {detail.value}
                      </a>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* ---- Form ---- */}
          <form action={formAction} className="rounded-card border border-line bg-panel/40 p-6 md:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-first-name" className={LABEL}>
                  First Name
                </label>
                <input
                  id="contact-first-name"
                  name="firstName"
                  autoComplete="given-name"
                  placeholder="John"
                  className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="contact-last-name" className={LABEL}>
                  Last Name
                </label>
                <input
                  id="contact-last-name"
                  name="lastName"
                  autoComplete="family-name"
                  placeholder="Doe"
                  className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className={LABEL}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="john.doe@gmail.com"
                  aria-invalid={state?.ok === false || undefined}
                  className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="contact-phone" className={LABEL}>
                  Phone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+234 8142 052 254"
                  className={FIELD}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="contact-message" className={LABEL}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Hi, type your message here..."
                  className={cn(FIELD, "h-auto resize-y py-3")}
                />
              </div>
            </div>

            {/* Honeypot — off-screen, unreachable by keyboard, ignored by people. */}
            <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <Button type="submit" size="lg" fullWidth loading={pending} className="mt-6">
              <Play aria-hidden className="size-4 fill-current" />
              Submit
            </Button>

            <p
              role="status"
              aria-live="polite"
              className={cn(
                "mt-4 flex items-center justify-center gap-2 text-xs",
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
          </form>
        </div>
      </Container>
    </section>
  );
}
