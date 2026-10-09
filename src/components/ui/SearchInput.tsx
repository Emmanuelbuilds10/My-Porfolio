"use client";

import { Search, X } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  /** Form GET target so the field still works with JavaScript disabled. */
  action?: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Fired on every keystroke (Phase 5 debounces this into the URL). */
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  className?: string;
  /** Accessible label — the design has no visible label. */
  label?: string;
}

/**
 * The rounded search field used on the Writing and Projects indexes.
 *
 * Renders a real `GET` form so pressing Enter works before hydration; the
 * parent can layer instant client filtering on top via `onChange`.
 */
export function SearchInput({
  action = "/writing",
  name = "q",
  defaultValue = "",
  placeholder = "Search posts",
  onChange,
  autoFocus = false,
  className,
  label = "Search",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function clear() {
    const input = inputRef.current;
    if (!input) return;
    input.value = "";
    onChange?.("");
    input.focus();
  }

  return (
    <form
      action={action}
      method="get"
      role="search"
      onSubmit={(event) => {
        // Empty query = clean URL rather than `?q=`.
        const input = inputRef.current;
        if (input && input.value.trim() === "") {
          event.preventDefault();
          window.location.assign(action);
        }
      }}
      className={cn("relative w-full max-w-[380px]", className)}
    >
      <label htmlFor={`${name}-search`} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint"
      />
      <input
        ref={inputRef}
        id={`${name}-search`}
        type="search"
        name={name}
        defaultValue={defaultValue}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        className={cn(
          "h-11 w-full rounded-button border border-line-strong bg-well pr-10 pl-10",
          "text-sm text-fg placeholder:text-faint",
          "transition-colors duration-200 ease-out-soft",
          "hover:border-line-strong focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none",
          "[&::-webkit-search-cancel-button]:appearance-none",
        )}
      />
      <button
        type="button"
        onClick={clear}
        className={cn(
          "absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-pill",
          "text-faint transition-colors duration-200 hover:bg-accent-soft hover:text-accent",
        )}
      >
        <X aria-hidden className="size-3.5" />
        <span className="sr-only">Clear search</span>
      </button>
    </form>
  );
}
