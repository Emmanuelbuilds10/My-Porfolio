import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

/** Instant loading UI for a project while its case-study streams in. */
export default function ProjectLoading() {
  return (
    <Container className="pb-section">
      <div className="max-w-[760px] pt-16">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-6 h-6 w-24 rounded-pill" />
        <Skeleton className="mt-5 h-10 w-10/12" />
        <Skeleton className="mt-5 h-4 w-full max-w-[560px]" />
        <div className="mt-8 flex gap-3">
          <Skeleton className="h-11 w-32 rounded-button" />
          <Skeleton className="h-11 w-36 rounded-button" />
        </div>
      </div>

      <Skeleton className="mt-10 aspect-[16/9] w-full rounded-media" />

      <div className="mt-12 max-w-[680px] space-y-4">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </Container>
  );
}
