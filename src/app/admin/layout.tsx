import type { Metadata } from "next";
import type { ReactNode } from "react";

/** Everything under /admin is private: no indexing, no description. */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-canvas">{children}</div>;
}
