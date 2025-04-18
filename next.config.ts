import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript
  },
};

export default nextConfig;
