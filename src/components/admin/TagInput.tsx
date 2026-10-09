"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TagInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

/** Chips with free entry (Enter/comma) plus one-click suggestions. */
export function TagInput({
  label,
  values,
  onChange,
  suggestions = [],
  placeholder,
  className,
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function add(raw: string) {
    const value = raw.trim();
    if (!value) return;
    if (values.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...values, value]);
    setDraft("");
  }

  function remove(value: string) {
    onChange(values.filter((existing) => existing !== value));
  }

  const remaining = suggestions
    .filter((suggestion) => !values.some((v) => v.toLowerCase() === suggestion.toLowerCase()))
    .slice(0, 8);

  return (
    <div className={className}>
      <span className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
        {label}
      </span>

      <div
        className={cn(
          "mt-2 flex min-h-11 flex-wrap items-center gap-2 rounded-button border border-line-strong bg-well px-3 py-2",
          "transition-colors duration-200 focus-within:border-accent",
        )}
      >
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-1 rounded-pill bg-accent px-2.5 py-1 text-[11px] leading-none text-on-accent"
          >
            {value}
            <button
              type="button"
              onClick={() => remove(value)}
              className="transition-opacity hover:opacity-70"
            >
              <X aria-hidden className="size-3" />
              <span className="sr-only">Remove {value}</span>
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add(draft);
            } else if (event.key === "Backspace" && !draft && values.length > 0) {
              remove(values[values.length - 1]);
            }
          }}
          onBlur={() => add(draft)}
          placeholder={values.length ? undefined : placeholder}
          autoComplete="off"
          className="min-w-[8ch] flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-faint"
        />
      </div>

      {remaining.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {remaining.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                add(suggestion);
                inputRef.current?.focus();
              }}
              className="inline-flex items-center gap-1 rounded-pill border border-line px-2 py-1 text-[11px] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Plus aria-hidden className="size-2.5" />
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
