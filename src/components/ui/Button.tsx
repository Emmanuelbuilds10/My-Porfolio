import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * Shared class builder. Exported so `Button` and `ButtonLink` render pixel
 * identical surfaces and can never drift apart.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-button font-medium whitespace-nowrap",
    "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out-soft",
    "hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-55",
    VARIANTS[variant],
    SIZES[size],
    fullWidth && "w-full",
    className,
  );
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent shadow-accent hover:bg-accent-strong",
  secondary:
    "border border-line-strong text-fg hover:border-accent hover:text-accent",
  ghost: "text-muted hover:bg-accent-soft hover:text-accent",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Swaps the label for a spinner and blocks interaction. */
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

type ButtonProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps | "children">;

type ButtonLinkProps = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps | "children"> & {
    href: string;
    /** Force a new tab. Auto-detected for absolute and `mailto:` hrefs. */
    external?: boolean;
  };

export function Button({
  variant,
  size,
  loading = false,
  fullWidth,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  loading = false,
  fullWidth,
  className,
  children,
  href,
  external,
  target,
  rel,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonStyles({ variant, size, fullWidth, className });
  const isExternal = external ?? /^(https?:)?\/\/|^mailto:|^tel:/.test(href);
  const content = (
    <>
      {loading ? <LoaderCircle aria-hidden className="size-4 animate-spin" /> : null}
      {children}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        target={target ?? "_blank"}
        rel={rel ?? "noreferrer noopener"}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} target={target} rel={rel} {...rest}>
      {content}
    </Link>
  );
}
