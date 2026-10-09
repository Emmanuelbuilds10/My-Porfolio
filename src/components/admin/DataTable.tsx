import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  columns: string[];
  children: ReactNode;
  className?: string;
}

/** Shared cell classes so every admin table row lines up. */
export const tdBase = "px-4 py-3 align-middle";
export const rowBase = "transition-colors hover:bg-panel/40";

/** Horizontally scrollable table shell. Rows are passed as `<tr>` children. */
export function DataTable({ columns, children, className }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-card border border-line", className)}>
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-panel/40 text-left">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-3 text-[11px] font-medium tracking-[0.12em] whitespace-nowrap text-faint uppercase"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}
