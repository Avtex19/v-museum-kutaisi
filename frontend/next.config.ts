import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.metmuseum.org" },
      { protocol: "http",  hostname: "localhost", port: "8000" },
      { protocol: "http",  hostname: "backend",   port: "8000" },
    ],
  },
};

export default nextConfig;