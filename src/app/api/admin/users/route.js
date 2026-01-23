import { getUsersCollection } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const usersCollection = await getUsersCollection();
    const users = await usersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      users: users.map((u) => {
        const { passwordHash, ...safe } = u; // strip passwordHash
        return {
          ...safe,
          _id: u._id?.toString?.() || u._id,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, role = "admin", password } = body || {};

    if (!name || !String(name).trim()) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !String(email).trim()) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password || String(password).length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();

    const existing = await usersCollection.findOne({
      email: String(email).trim().toLowerCase(),
    });
    if (existing) {
      return Response.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const doc = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      role: String(role || "admin").trim(),
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(doc);

    return Response.json(
      { success: true, userId: result.insertedId?.toString?.() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Failed to create user" }, { status: 500 });
  }
}

