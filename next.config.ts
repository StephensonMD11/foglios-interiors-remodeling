import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "fogliosinteriors.com" }],
        destination: "https://www.fogliosinteriors.com/:path*",
        permanent: true,
      },
    ];
  },
  experimental: {
    // Allow larger admin photo uploads through the app proxy layer.
    proxyClientMaxBodySize: "20mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
