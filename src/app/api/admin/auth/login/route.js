import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";

export async function POST(request) {
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

    // Create a simple session token (for real prod, sign or use JWT)
    const tokenPayload = {
      userId: user._id?.toString?.() || user._id,
      role: user.role || "admin",
      email: user.email,
    };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    const res = NextResponse.json({ success: true });

    res.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // no maxAge => session cookie (login required again after browser close)
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