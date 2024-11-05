# iFrame Child Repository
This repository provides the code for a child iFrame application built with Next.js. The iFrame child application generates an access token upon request from an iFrame parent, verifying its API_KEY_SECRET for security. This token is then sent back to the parent for use in authentication.

## Features
- Access Token Generation: Creates an access token upon receiving a request from the iFrame parent and verifies the API_KEY_SECRET before generation.
- Token Validation: Verifies the access token with each incoming request to ensure secure communication.
- Secure Communication: Allows cross-origin communication by setting appropriate headers.

## Getting Started
### Prerequisites
Ensure you have:
- Node.js and npm installed.
- A .env file set up with the required environment variables.

### Installation
1- Clone this repository:
```bash
git clone https://github.com/PatternedAI/demo-iframe.git
```
2- Navigate to the project directory:
``` bash
cd demo-iframe
```
3- Install dependencies:
``` bash
npm install
```
4- Environment Variables: Create a .env file in the root directory with the following content:
```env
PARENT_SITE_URL=http://localhost:3000 # or the actual parent site URL (https://demo-iframe-parent-roan.vercel.app)
CHILD_SITE_URL=http://localhost:3001 # or the deployed child site URL (https://demo-iframe-green.vercel.app)
JWT_SECRET="super-secret-key"
JWT_SECRET_EXPIRES_IN="15m"
API_KEY_SECRET="hello-world"
```
### Run the Application
```bash
npm run dev
```
Visit http://localhost:3001 to view the application.


### Code Overview
#### API Route - Access Token Generation
The POST API route at /api/get-jwt verifies the auth_secret provided by the parent. If verified, it generates an access token using JWT_SECRET with a set expiration.
```ts
// /api/get-jwt/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const JWT_SECRET_EXPIRES_IN = "15m"; 
const API_KEY_SECRET = process.env.API_KEY_SECRET!;

export async function POST(req: Request) {
  try {
    const { auth_secret } = await req.json();

    if (API_KEY_SECRET === auth_secret) {
      const accessToken = jwt.sign({ auth_secret }, JWT_SECRET, {
        expiresIn: JWT_SECRET_EXPIRES_IN,
      });
      return NextResponse.json({ accessToken });
    } else {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error generating token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
```
#### API Route - Token Validation
The POST API route at /api/validate-access-token verifies the validity of the access token, responding with a valid status if the token is valid or an error if it is not.
```ts
// /api/validate-access-token/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    jwt.verify(token, JWT_SECRET); // Verify the token
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Invalid token" },
      { status: 401 }
    );
  }
}
```

### iFrame UI
The iFrame UI displays the access token and logs messages received from the parent. It sends messages back to the parent on token expiration or updates.
- Token Verification: The iFrame verifies the token validity using /api/validate-access-token.
- Event Handling: Listens for messages from the parent and responds with the access token or expiration events.


### Configuration
#### Middleware - CORS Headers
The middleware file configures Access-Control-Allow-Origin to allow secure cross-origin requests from the parent.

```ts
// middleware.ts
import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();
  res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.PARENT_SITE_URL || "http://localhost:3000"
  );
  return res;
}

export const config = {
  matcher: "/api/get-jwt",
};
```

#### Next.js Configuration
The next.config.js file configures Access-Control-Allow-Origin and Content-Security-Policy headers for secure iFrame embedding.

```ts
// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.PARENT_SITE_URL || "http://localhost:3000",
          },
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors 'self' ${process.env.PARENT_SITE_URL}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Additional Notes
- Token Expiration: The iFrame will request a new token if the current one expires.
- Debugging: Console logs for both the iFrame and parent applications facilitate debugging during development.
