import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your_access_secret_key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret_key";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
// const ACCESS_TOKEN_EXPIRES_IN = "5s"; // Set to 5 seconds for testing

const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    // Generate the access token
    const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    // Generate one refresh token
    const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    return NextResponse.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error generating tokens:", error);
    return NextResponse.json(
      { error: "Failed to generate tokens" },
      { status: 500 },
    );
  }
}
