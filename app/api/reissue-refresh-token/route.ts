import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret_key";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Generate a new refresh token
    const newRefreshToken = jwt.sign(
      { userId: (decoded as { userId: string }).userId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    return NextResponse.json({ refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Error reissuing refresh token:", error);
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 403 },
    );
  }
}
