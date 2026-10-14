import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { legal } from "@/lib/legal";

interface LegalShellProps {
  title: string;
  /** One line under the title saying what the document covers. */
  summary: string;
  children: ReactNode;
}

/**
 * Layout for the three policy pages.
 *
 * The body is wrapped in `prose-post`, the same class the blog renderer uses,
 * so headings, lists and links inside the policies follow the design system
 * without every page restating the typography.
 */
export function LegalShell({ title, summary, children }: LegalShellProps) {
  return (
    <Container size="prose" className="pb-section">
      <header className="pt-16">
        <p className="text-[11px] font-medium tracking-[0.14em] text-faint uppercase">
          Last updated {legal.lastUpdated}
        </p>
        <h1 className="mt-4 font-serif text-[clamp(1.9rem,4.5vw,2.75rem)] leading-[1.1] text-fg">
          {title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">{summary}</p>
      </header>

      <div className="prose-post mt-12">{children}</div>
    </Container>
  );
}
