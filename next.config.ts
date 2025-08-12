import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "ferf1mheo22r9ira.public.blob.vercel-storage.com",
      "i9.ytimg.com",
      "i.ytimg.com",
    ],
  },
  eslint: {
    // Warning: only disables ESLint during builds, not locally!
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
