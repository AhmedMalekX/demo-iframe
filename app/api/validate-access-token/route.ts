import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "your_access_secret_key";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log({ body });
    const { token } = body;

    // Verify and decode the access token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    console.log({ decoded });

    // Return success with the decoded user information
    return NextResponse.json({
      valid: true,
      userId: (decoded as { userId: string }).userId,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Invalid token" },
      { status: 401 },
    );
  }
}
