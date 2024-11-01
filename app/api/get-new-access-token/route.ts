import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "your_access_secret_key";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret_key";
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

// const ACCESS_TOKEN_EXPIRES_IN = "5s"; // Set to 5 seconds for testing

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: (decoded as { userId: string }).userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 },
    );
  }
}
