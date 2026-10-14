import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  label: string;
  href: string;
  active?: boolean;
  className?: string;
}

/**
 * Filter chip for the Writing and Projects indexes. Outlined by default, solid
 * violet when active. Renders a link so filters stay shareable via the URL.
 */
export function CategoryChip({
  label,
  href,
  active = false,
  className,
}: CategoryChipProps) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex items-center rounded-pill border px-5 py-2.5 text-sm font-medium",
        "transition-colors duration-200 ease-out-soft",
        active
          ? "border-accent bg-accent-fill text-on-accent"
          : "border-line-strong text-muted hover:border-accent hover:text-accent-text",
        className,
      )}
    >
      {label}
    </Link>
  );
}
