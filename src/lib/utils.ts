import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Turn a site-relative path into an absolute URL (metadata, RSS, JSON-LD). */
export function absoluteUrl(path: string, base: string) {
  return new URL(path, base).toString();
}
