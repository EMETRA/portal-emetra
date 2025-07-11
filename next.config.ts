import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Esta línea es CRUCIAL para Docker
  output: "standalone",

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
