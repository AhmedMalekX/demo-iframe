import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://demo-iframe-parent.vercel.app",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://demo-iframe-parent.vercel.app",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
