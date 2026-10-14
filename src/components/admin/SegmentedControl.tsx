"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

/** iOS-style segmented switch. Purely presentational; the caller owns state. */
export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  disabled = false,
  className,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        "inline-flex rounded-button border border-line-strong bg-well p-1",
        disabled && "opacity-60",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-[9px] px-4 py-2 text-sm font-medium transition-colors duration-200",
              active ? "bg-accent-fill text-on-accent" : "text-muted hover:text-fg",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
