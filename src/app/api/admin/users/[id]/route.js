import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(_request, { params }) {
  try {
    const oid = toObjectId(params?.id);
    if (!oid) return NextResponse.json({ error: "Invalid user id" }, { status: 400 });

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localUser, atlasUser] = await Promise.all([
      localDb.collection('users').findOne({ _id: oid }),
      atlasDb.collection('users').findOne({ _id: oid })
    ]);

    const user = localUser || atlasUser;
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      user: { ...user, _id: user._id?.toString?.() || user._id },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const oid = toObjectId(params?.id);
    if (!oid) return NextResponse.json({ error: "Invalid user id" }, { status: 400 });

    const body = await request.json();
    const update = {};

    if ("name" in (body || {})) {
      const name = String(body.name || "").trim();
      if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
      update.name = name;
    }

    if ("email" in (body || {})) {
      const email = String(body.email || "").trim();
      if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
      update.email = email.toLowerCase();
    }

    if ("role" in (body || {})) {
      update.role = String(body.role || "").trim() || "admin";
    }

    update.updatedAt = new Date();

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection('users').updateOne({ _id: oid }, { $set: update }),
      atlasDb.collection('users').updateOne({ _id: oid }, { $set: update })
    ]);

    if (localResult.matchedCount === 0 && atlasResult.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const oid = toObjectId(params?.id);
    if (!oid) return NextResponse.json({ error: "Invalid user id" }, { status: 400 });

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection('users').deleteOne({ _id: oid }),
      atlasDb.collection('users').deleteOne({ _id: oid })
    ]);

    if (localResult.deletedCount === 0 && atlasResult.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

