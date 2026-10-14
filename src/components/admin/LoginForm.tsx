"use client";

import { useActionState } from "react";
import { CircleAlert, Lock } from "lucide-react";
import { signIn } from "@/lib/admin/actions/auth";
import { Button } from "@/components/ui/Button";

/** Centred sign-in card. Uses a Server Action so credentials never touch JS. */
export function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="w-full max-w-[400px] rounded-card border border-line bg-panel p-8 shadow-card">
      <span className="grid size-10 place-items-center rounded-button bg-accent-soft text-accent-text">
        <Lock aria-hidden className="size-5" />
      </span>
      <h1 className="mt-5 font-serif text-2xl text-fg">Admin sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in with the admin account to manage content.
      </p>

      {configured ? (
        <form action={formAction} className="mt-7 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-11 w-full rounded-button border border-line-strong bg-well px-4 text-sm text-fg outline-none transition-colors focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-11 w-full rounded-button border border-line-strong bg-well px-4 text-sm text-fg outline-none transition-colors focus:border-accent"
            />
          </label>

          <Button type="submit" loading={pending} fullWidth size="lg">
            Sign in
          </Button>

          <p role="status" aria-live="polite" className="min-h-5 text-xs text-danger">
            {state && !state.ok ? (
              <span className="inline-flex items-center gap-1.5">
                <CircleAlert aria-hidden className="size-3.5 shrink-0" />
                {state.message}
              </span>
            ) : null}
          </p>
        </form>
      ) : (
        <div className="mt-7 rounded-button border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-fg">
          Supabase isn&rsquo;t configured. Add{" "}
          <code className="rounded bg-well px-1.5 py-0.5 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
          <code className="rounded bg-well px-1.5 py-0.5 text-xs">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          and{" "}
          <code className="rounded bg-well px-1.5 py-0.5 text-xs">ADMIN_EMAIL</code> to{" "}
          <code className="rounded bg-well px-1.5 py-0.5 text-xs">.env.local</code>, then restart
          the dev server.
        </div>
      )}
    </div>
  );
}
