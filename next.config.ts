import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": "./src/components/index",
      "@components/*": "./src/components/*",
    };
    return config;
  },
};

export default nextConfig;
