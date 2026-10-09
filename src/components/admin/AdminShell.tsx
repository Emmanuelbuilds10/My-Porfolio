"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { signOut } from "@/lib/admin/actions/auth";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Content", icon: LayoutDashboard, exact: true },
  { href: "/admin/new", label: "New", icon: Plus, exact: false },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, exact: false },
  { href: "/admin/facts", label: "Facts", icon: Sparkles, exact: false },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users, exact: false },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

/** Chrome for every protected admin page: slim sidebar, top bar, mobile drawer. */
export function AdminShell({
  email,
  demo = false,
  children,
}: {
  email: string;
  /** True when running on sample data because Supabase isn't configured. */
  demo?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav aria-label="Admin" className="flex flex-col gap-1 p-3">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-3 rounded-button px-3 py-2.5 text-sm transition-colors duration-200",
              active ? "bg-accent-soft text-accent" : "text-muted hover:bg-panel/60 hover:text-fg",
            )}
          >
            <item.icon aria-hidden className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
        <div className="flex h-14 items-center gap-3 px-4 md:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="-ml-1 grid size-9 place-items-center rounded-button text-muted hover:bg-accent-soft hover:text-accent lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
            <span className="sr-only">Open menu</span>
          </button>

          <Link href="/admin" className="font-serif text-lg text-fg">
            {site.name}
            <span className="ml-2 align-middle text-[11px] tracking-[0.14em] text-faint uppercase">
              admin
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden text-sm text-muted transition-colors hover:text-accent sm:inline"
            >
              View site ↗
            </Link>
            <span className="hidden text-xs text-faint md:inline">{email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-button border border-line-strong px-3 py-2 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <LogOut aria-hidden className="size-3.5" />
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {demo ? (
        <div className="border-b border-warn/40 bg-warn/10 px-4 py-2.5 text-center text-xs text-fg md:px-6">
          Demo mode — showing sample data. Changes aren&apos;t saved; configure Supabase to
          edit for real.
        </div>
      ) : null}

      <div className="flex flex-1">
        <aside className="hidden w-[220px] shrink-0 border-r border-line lg:block">
          <div className="sticky top-14">{nav}</div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>

      {/* Mobile drawer */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 bg-canvas/70 backdrop-blur-sm lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
          "transition-opacity duration-300",
        )}
      />
      <aside
        aria-label="Admin menu"
        className={cn(
          "fixed top-0 right-0 z-50 flex h-dvh w-[260px] flex-col border-l border-line bg-canvas lg:hidden",
          "transition-transform duration-300 ease-out-soft",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <span className="font-serif text-lg text-fg">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-9 place-items-center rounded-button text-muted hover:bg-accent-soft hover:text-accent"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        {nav}
      </aside>
    </div>
  );
}
