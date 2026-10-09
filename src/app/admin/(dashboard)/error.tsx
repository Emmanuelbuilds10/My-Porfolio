"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Error boundary for the protected admin pages. */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-[480px] rounded-card border border-line bg-panel/50 p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-pill bg-danger-soft text-danger">
        <CircleAlert aria-hidden className="size-5" />
      </span>
      <h1 className="mt-5 font-serif text-xl text-fg">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted">
        {error.message || "The admin couldn't load this view."}
      </p>
      <div className="mt-6 flex justify-center">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
