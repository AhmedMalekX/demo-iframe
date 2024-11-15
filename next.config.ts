import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dsm6fpp1ioao4.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "d8c4cbe2y3ofj.cloudfront.net",
      },
    ],
  },
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
