import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  className?: string;
}

/** One of the four numbers at the top of the admin dashboard. */
export function StatCard({ label, value, icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-card border border-line bg-panel/40 p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
          {label}
        </p>
        {icon ? <span className="text-accent-text">{icon}</span> : null}
      </div>
      <p className="mt-3 font-serif text-3xl text-fg">{value}</p>
    </div>
  );
}
