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
  // Dev
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*",
  //       headers: [
  //         {
  //           key: "Access-Control-Allow-Origin",
  //           value: "http://localhost:3000/",
  //         },
  //         {
  //           key: "Content-Security-Policy",
  //           value: "frame-ancestors 'self' http://localhost:3000/",
  //         },
  //       ],
  //     },
  //   ];
  // },

  // Production

  async headers() {
    return [
      {
        source: "/:path*", // Apply to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' https://dev-demo-iframe.vercel.app https://demo-iframe-ten.vercel.app https://demo-iframe-green.vercel.app https://dev-demo-iframe-parent.vercel.app`,
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://dev-demo-iframe-parent.vercel.app", // Allow requests from this domain
          },
        ],
      },
    ];
  },
};

export default nextConfig;
