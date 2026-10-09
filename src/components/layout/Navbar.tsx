"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { GithubIcon, TwitterIcon } from "@/components/icons";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sticky header. Transparent over the page background, then a blurred bar with
 * a hairline border and shadow once the page scrolls behind it.
 *
 * The labels come from `navLinks` — a short list: Home, Work, About, Blog.
 */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape to close, and lock the page behind the drawer while it is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        "transition-[background-color,border-color,box-shadow] duration-300 ease-out-soft",
        scrolled
          ? "border-b border-line bg-canvas/85 shadow-raised backdrop-blur-md"
          : "border-b border-transparent bg-canvas/60 backdrop-blur-sm",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Link
          href="/"
          className="font-serif text-xl text-fg transition-colors duration-200 hover:text-accent"
        >
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "nav-link text-sm transition-colors duration-200",
                  active ? "text-accent" : "text-muted hover:text-fg",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-mr-2 grid size-10 place-items-center rounded-button text-muted transition-colors hover:bg-accent-soft hover:text-accent md:hidden"
        >
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </Container>

      {/* Scrim */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 top-16 z-40 bg-canvas/70 backdrop-blur-sm md:hidden",
          "transition-opacity duration-300 ease-out-soft",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer — `invisible` when closed keeps the links out of the tab order. */}
      <aside
        id="mobile-menu"
        aria-label="Menu"
        className={cn(
          "fixed top-0 right-0 z-50 flex h-dvh w-[280px] flex-col gap-8 border-l border-line bg-canvas p-6 md:hidden",
          "transition-[transform,visibility] duration-300 ease-out-soft",
          open ? "visible translate-x-0" : "invisible translate-x-full",
        )}
      >
        <div className="flex h-10 items-center justify-between">
          <span className="font-serif text-lg text-fg">{site.name}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="-mr-2 grid size-10 place-items-center rounded-button text-muted transition-colors hover:bg-accent-soft hover:text-accent"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-button px-3 py-3 font-serif text-lg transition-colors duration-200",
                  active ? "bg-accent-soft text-accent" : "text-fg hover:bg-accent-soft",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-5 border-t border-line pt-6">
          <a
            href={site.twitterUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted transition-colors hover:text-accent"
          >
            <TwitterIcon className="size-4" />
            <span className="sr-only">Twitter</span>
          </a>
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-muted transition-colors hover:text-accent"
          >
            <GithubIcon className="size-4" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </aside>
    </header>
  );
}
