import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@top-tier-id/database", "@top-tier-id/types", "@top-tier-id/validators"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
