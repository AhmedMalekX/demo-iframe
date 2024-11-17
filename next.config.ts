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
    const parentUrl =
      process.env.NODE_ENV === "production"
        ? "https://dev-demo-iframe-parent.vercel.app"
        : "http://localhost:3000";
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: parentUrl,
          },
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${parentUrl}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
