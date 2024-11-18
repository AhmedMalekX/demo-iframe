import type { NextConfig } from "next";

const parentURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://dev-demo-iframe.vercel.app/";

const currentHost = "https://dev-demo-iframe.vercel.app/";

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
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: parentURL,
          },
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${parentURL} ${currentHost}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
