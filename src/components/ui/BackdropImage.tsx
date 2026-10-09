"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BackdropImageProps {
  src?: string | null;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Full-bleed background image (hero artwork, future admin previews).
 *
 * Renders nothing if the file is missing or fails to load, so the panel's own
 * gradient shows through instead of a broken-image icon. `next/image` gives us
 * no way to detect a missing file on the server, hence the client boundary.
 */
export function BackdropImage({
  src,
  sizes = "100vw",
  priority = false,
  className,
}: BackdropImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
