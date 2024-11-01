import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log({ body });

    const { token } = body;

    // Verify and decode the access token
    const decoded = jwt.verify(token, JWT_SECRET);

    console.log({ decoded });

    // Return success with the decoded user information
    return NextResponse.json({
      valid: true,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Invalid token" },
      { status: 401 },
    );
  }
}
