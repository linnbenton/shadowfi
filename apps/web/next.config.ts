import type { NextConfig } from "next";

console.log("shadowfi test update");

const nextConfig: NextConfig = {
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
