import type { NextConfig } from "next";
module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
}
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
    return config;
  },
};

export default nextConfig;
