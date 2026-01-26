import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { createJWTToken } from "@/lib/jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !String(email).trim() || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const normalizedEmail = String(email).trim().toLowerCase();

    const [localUser, atlasUser] = await Promise.all([
      localDb.collection('users').findOne({ email: normalizedEmail }),
      atlasDb.collection('users').findOne({ email: normalizedEmail })
    ]);

    const user = localUser || atlasUser;

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create a secure JWT token
    const tokenPayload = {
      userId: user._id?.toString?.() || user._id,
      role: user.role || "admin",
      email: user.email,
    };
    
    // Create JWT token (expires in 7 days by default)
    const authToken = await createJWTToken(tokenPayload);

    const res = NextResponse.json({ 
      success: true,
      user: {
        id: tokenPayload.userId,
        email: tokenPayload.email,
        role: tokenPayload.role
      }
    });

    // Set the JWT token as an httpOnly cookie
    res.cookies.set("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    // Also set legacy adminToken for backward compatibility (optional)
    const legacyToken = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");
    res.cookies.set("adminToken", legacyToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return res;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 }
    );
  }
}