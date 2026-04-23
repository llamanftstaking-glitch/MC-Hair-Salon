import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [],
  },
  allowedDevOrigins: ["*.replit.dev", "*.replit.app"],
};

export default nextConfig;
