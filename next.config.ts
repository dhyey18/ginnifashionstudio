import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode catches subtle React bugs during development
  reactStrictMode: true,

  // Compress responses
  compress: true,

  // Prevent search engines from indexing while in development
  // Remove this for production deployment
  // headers: async () => [{ source: "/(.*)", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }],
};

export default nextConfig;
