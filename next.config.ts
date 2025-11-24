import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: undefined,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
};

export default nextConfig;
