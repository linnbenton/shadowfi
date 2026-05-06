import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        "**/node_modules",
        "D:/System Volume Information",
        "D:/found.*",
      ],
    };
    return config;
  },
};

export default nextConfig;
