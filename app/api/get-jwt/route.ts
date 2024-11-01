import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// env variables
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
// const JWT_SECRET_EXPIRES_IN = process.env.JWT_SECRET_EXPIRES_IN || "15m";
const JWT_SECRET_EXPIRES_IN = "5s"; // Set to 5 seconds for testing
const API_KEY_SECRET = process.env.API_KEY_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { auth_secret } = body;

    if (API_KEY_SECRET === auth_secret) {
      const accessToken = jwt.sign({ auth_secret }, JWT_SECRET, {
        expiresIn: JWT_SECRET_EXPIRES_IN,
      });

      return NextResponse.json({ accessToken });
    } else {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, statusText: "Unauthorized!" },
      );
    }
  } catch (error) {
    console.error("Error generating tokens:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 },
    );
  }
}
