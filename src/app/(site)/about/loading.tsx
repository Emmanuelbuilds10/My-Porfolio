import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

/** Instant loading UI for /about while settings and facts resolve. */
export default function AboutLoading() {
  return (
    <Container className="pb-section">
      <div className="max-w-[720px] pt-16">
        <Skeleton className="size-24 rounded-pill" />
        <Skeleton className="mt-6 h-7 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      </div>

      <div className="mt-section">
        <Skeleton className="h-8 w-52" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-36 rounded-card" />
          ))}
        </div>
      </div>
    </Container>
  );
}
