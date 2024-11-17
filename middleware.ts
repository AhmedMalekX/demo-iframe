import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();

  console.log({ child: process.env.NEXT_PUBLIC_PARENT_SITE_URL });

  res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_PARENT_SITE_URL ||
      "https://dev-demo-iframe-parent.vercel.app" ||
      "http://localhost:3000",
  );
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return res;
}

export const config = {
  matcher: "/api/get-jwt",
};
