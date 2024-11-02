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
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://demo-iframe-parent.vercel.app",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
