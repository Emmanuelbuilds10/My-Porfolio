"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
  lg: "size-24 text-2xl",
} as const;

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * Circular avatar used in the author card and on the About page. Falls back to
 * the person's initial so the circle is never empty.
 */
export function Avatar({ src, name, size = "sm", className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-pill",
        "bg-panel font-medium text-muted ring-1 ring-line-strong",
        SIZES[size],
        className,
      )}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="96px"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <span aria-hidden>{initial}</span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}
