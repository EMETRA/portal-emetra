import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  sassOptions: {
    prependData: `@use "./src/theme/index.scss" as *;`,
  },
  images: {
    // domains: ["localhost"],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },

    ],
  },
  async headers() {
    return [{ source: '/vivi/correo/:path*', headers: [
      { key: 'Cache-Control', value: 'private, no-store' },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
    ] }];
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.resolve(__dirname, "src/components"),
      "@atoms": path.resolve(__dirname, "src/components/atoms"),
      "@molecules": path.resolve(__dirname, "src/components/molecules"),
      "@organisms": path.resolve(__dirname, "src/components/organisms"),
      "@templates": path.resolve(__dirname, "src/components/templates"),
      "@pages": path.resolve(__dirname, "src/components/pages"),
      "@schema": path.resolve(__dirname, "src/schema"),
      "@theme": path.resolve(__dirname, "src/theme"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@store": path.resolve(__dirname, "src/store"),
      "@public": path.resolve(__dirname, "public"),
      "@mocks": path.resolve(__dirname, "src/mocks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@functions": path.resolve(__dirname, "src/functions"),
    };
    return config;
  },
};

export default nextConfig;
