import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center py-section">
      <Container className="text-center">
        <p className="font-serif text-sm tracking-[0.14em] text-accent-text uppercase">
          {site.name}
        </p>
        <h1 className="mt-6 font-serif text-[clamp(2rem,5vw,3rem)] leading-tight text-fg">
          This page hasn&rsquo;t been written yet
        </h1>
        <p className="mx-auto mt-4 max-w-[420px] text-sm leading-relaxed text-muted">
          The link may be wrong, or the post may have been unpublished.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/">Back home</ButtonLink>
          <ButtonLink href="/writing" variant="secondary">
            Read the writing
          </ButtonLink>
        </div>
      </Container>
    </main>
  );
}
