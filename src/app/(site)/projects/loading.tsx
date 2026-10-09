import { Container } from "@/components/ui/Container";
import { Skeleton, CardGridSkeleton } from "@/components/ui/Skeleton";

/** Instant loading UI for /projects while filters resolve on the server. */
export default function ProjectsLoading() {
  return (
    <>
      <Skeleton className="h-[300px] w-full rounded-none md:h-[340px]" />

      <Container className="mt-section">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-11 w-full max-w-[380px] rounded-button" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-24 rounded-pill" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-10 w-24 rounded-pill" />
            ))}
          </div>
        </div>

        <Skeleton className="mt-8 h-4 w-36" />

        <div className="mt-6">
          <CardGridSkeleton count={9} />
        </div>
      </Container>
    </>
  );
}
