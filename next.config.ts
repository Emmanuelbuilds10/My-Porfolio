import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * The policy is deliberately plain: everything this site needs comes from its
 * own origin (fonts and art are self-hosted), plus Supabase for the admin's
 * data and uploads. `unsafe-inline` is required for scripts and styles because
 * Next inlines its bootstrap payload and React inlines critical CSS; there is
 * no raw-HTML surface anywhere in the app (markdown is rendered escaped), so
 * the residual risk is the framework's own inline payload rather than
 * anything user-generated. `unsafe-eval` is added in development only, where
 * Turbopack's HMR needs it.
 */
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // `https:` because a cover can be pasted as any URL in the admin.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co${isDev ? " ws: wss:" : ""}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Ignored on http://localhost, applied by every browser over https.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Stops `x-powered-by: Next.js` advertising the stack.
  poweredByHeader: false,
  // Explicit, though it is the default: no shipped source maps. The unminified
  // code of an app is a map of its internals, and nothing here needs it in
  // production. Local `next dev` still maps normally.
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      // Seed covers + any cover pasted as a URL. Admin uploads land on
      // Supabase Storage (<project>.supabase.co) — wildcarded below.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
