import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Markdown renderer shared by the post and project detail pages.
 *
 * Uses GFM (tables, task lists, strikethrough) and highlight.js for fenced
 * code. Elements that need the design system get explicit components; the
 * rest inherit `.prose-post` styles from globals.css.
 *
 * `rehype-highlight` needs its CSS — imported once here, and tree-shaken into
 * the pages that actually render markdown.
 */
import "highlight.js/styles/github-dark.css";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("prose-post", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={{
          a({ href, children }) {
            const external = Boolean(href && /^https?:\/\//.test(href));
            if (external) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            }
            return <Link href={href ?? "#"}>{children}</Link>;
          },
          img({ src, alt }) {
            // react-markdown types `src` as string | Blob; only strings can be
            // handed to next/image (or a plain <img>), so narrow first.
            const url = typeof src === "string" ? src : "";
            const remote = /^https?:\/\//.test(url);
            return (
              <span className="block overflow-hidden rounded-card">
                {/* Remote hosts are rare in body copy; a plain img avoids
                    next/image domain config for arbitrary URLs. */}
                {remote ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={alt ?? ""} loading="lazy" className="w-full" />
                ) : (
                  <span className="relative block aspect-[16/9]">
                    <Image
                      src={url}
                      alt={alt ?? ""}
                      fill
                      sizes="(min-width: 768px) 680px, 100vw"
                      className="object-cover"
                    />
                  </span>
                )}
              </span>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto rounded-card border border-line">
                <table className="w-full text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border-b border-line bg-panel/60 px-4 py-2.5 text-left font-medium text-fg">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border-b border-line px-4 py-2.5 align-top text-body">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
