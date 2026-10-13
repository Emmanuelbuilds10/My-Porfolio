import { cn } from "@/lib/utils";

/** Shimmering placeholder block used by the route-level `loading.tsx` files. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-media bg-panel/60", className)}
    />
  );
}

/** One card-shaped placeholder matching the 3-column grids. */
export function CardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[6/5] w-full" />
      <Skeleton className="mt-4 h-3 w-24" />
      <Skeleton className="mt-3 h-5 w-4/5" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/5" />
    </div>
  );
}

export function CardGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-card sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}
