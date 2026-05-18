import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.metmuseum.org" },
      { protocol: "http",  hostname: "backend",   port: "8000" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "http://backend:8000/api/:path*/",
      },
      {
        source: "/api/:path*",
        destination: "http://backend:8000/api/:path*/",
      },
      {
        source: "/media/:path*",
        destination: "http://backend:8000/media/:path*",
      },
    ];
  },
};

export default nextConfig;
