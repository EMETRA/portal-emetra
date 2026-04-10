import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Esta línea es CRUCIAL para Docker
  output: "standalone",

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": "./src/components/index",
      "@components/*": "./src/components/*",
      "@public": path.resolve(__dirname, "public"),
    };
    return config;
  },
};

export default nextConfig;
