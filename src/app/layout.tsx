import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/** Heading serif — the look of "THE BLOG" and every post title. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Body sans. */
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

/**
 * Pre-hydration scrub for browser-extension attributes (dev only).
 *
 * Extensions such as Bitdefender's web protection stamp their own markers —
 * `bis_skin_checked`, `bis_register`, `__processed_<guid>__` — onto elements
 * while the HTML is still parsing. The server never renders them, so React
 * reports an unpatchable hydration mismatch ("A tree hydrated but some
 * attributes of the server rendered HTML didn't match the client properties").
 *
 * This runs synchronously at the top of `<body>`, before the app bundle: it
 * strips any matching attributes already in the document, then watches for
 * more until shortly after `load`, by which point hydration has finished —
 * later injections are harmless because React only compares during hydration.
 * Scoped to development: production React ignores extra attributes entirely,
 * and we don't want to fight visitors' security software on the live site.
 *
 * Extend `PATTERN` if another extension's markers ever show up in the diff.
 */
const STRIP_EXTENSION_ATTRIBUTES = `(function () {
  var PATTERN = /^(bis_|__processed_)/;
  function strip(element) {
    if (!element || 1 !== element.nodeType || !element.attributes) return;
    for (var i = element.attributes.length - 1; i >= 0; i--) {
      if (PATTERN.test(element.attributes[i].name)) {
        element.removeAttribute(element.attributes[i].name);
      }
    }
  }
  function sweep(root) {
    strip(root);
    if (!root.querySelectorAll) return;
    var all = root.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) strip(all[i]);
  }
  sweep(document.documentElement);
  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      if ('attributes' === record.type) {
        if (record.attributeName && PATTERN.test(record.attributeName)) strip(record.target);
      } else {
        for (var j = 0; j < record.addedNodes.length; j++) sweep(record.addedNodes[j]);
      }
    }
  });
  observer.observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true
  });
  var stop = function () {
    setTimeout(function () { observer.disconnect(); }, 5000);
  };
  if ('complete' === document.readyState) stop();
  else window.addEventListener('load', stop);
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@emmanuel",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {process.env.NODE_ENV !== "production" && (
          <script dangerouslySetInnerHTML={{ __html: STRIP_EXTENSION_ATTRIBUTES }} />
        )}
        {children}
      </body>
    </html>
  );
}
