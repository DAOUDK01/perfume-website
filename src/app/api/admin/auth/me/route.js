import { NextRequest, NextResponse } from "next/server";
import { verifyJWTToken } from "@/lib/jwt";

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const authToken = request.cookies.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: "No authentication token" },
        { status: 401 }
      );
    }

    // Verify and decode the JWT token
    const payload = await verifyJWTToken(authToken);
    
    // Return user info (without sensitive data)
    return NextResponse.json({
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role
      }
    });
  } catch (error) {
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { error: "Invalid authentication token" },
      { status: 401 }
    );
  }
}