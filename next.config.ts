import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TODO: uncomment the code before push any code to the git repo
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://demo-iframe-parent-roan.vercel.app/",
          },
          {
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self' https://demo-iframe-parent-roan.vercel.app/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
