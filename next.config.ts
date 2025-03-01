import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  cacheOnNavigation: true,
  reloadOnOnline: true,
});

const nextConfig: NextConfig = withSerwist({
  images: {
    domains: ["images.unsplash.com", "rbsfpvhgnpqrkiwkolya.supabase.co"],
  },
});

export default nextConfig;
