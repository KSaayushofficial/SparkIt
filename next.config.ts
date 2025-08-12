import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ferf1mheo22r9ira.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "i9.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  eslint: {
    // Warning: only disables ESLint during builds, not locally!
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
