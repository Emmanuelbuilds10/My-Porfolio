import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Seed covers + any cover pasted as a URL. Admin uploads land on
      // Supabase Storage (<project>.supabase.co) — wildcarded below.
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
