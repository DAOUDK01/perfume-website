import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const localUsers = await localDb.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const atlasUsers = await atlasDb.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const combinedUsers = [...localUsers, ...atlasUsers];
    const uniqueUsers = Array.from(new Map(combinedUsers.map(user => [user.email, user])).values());

    return NextResponse.json({
      success: true,
      users: uniqueUsers.map((u) => {
        const { passwordHash, ...safe } = u; // strip passwordHash
        return {
          ...safe,
          _id: u._id?.toString?.() || u._id,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, role = "admin", password } = body || {};

    if (!name || !String(name).trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !String(email).trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || String(password).length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const normalizedEmail = String(email).trim().toLowerCase();

    const [localExisting, atlasExisting] = await Promise.all([
      localDb.collection('users').findOne({ email: normalizedEmail }),
      atlasDb.collection('users').findOne({ email: normalizedEmail })
    ]);

    if (localExisting || atlasExisting) {
      return NextResponse.json(
        { error: "A user with this email already exists in one or both databases" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const doc = {
      name: String(name).trim(),
      email: normalizedEmail,
      role: String(role || "admin").trim(),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection('users').insertOne(doc),
      atlasDb.collection('users').insertOne(doc)
    ]);

    return NextResponse.json(
      { 
        success: true, 
        localUserId: localResult.insertedId?.toString?.(),
        atlasUserId: atlasResult.insertedId?.toString?.(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

