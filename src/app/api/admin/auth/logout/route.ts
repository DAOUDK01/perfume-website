import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: "Logged out successfully" 
    });
    
    // Clear both auth tokens
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict' as const,
      path: "/",
      expires: new Date(0) // Expire immediately
    };
    
    response.cookies.set("authToken", "", cookieOptions);
    response.cookies.set("adminToken", "", cookieOptions);
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Failed to log out" },
      { status: 500 }
    );
  }
}