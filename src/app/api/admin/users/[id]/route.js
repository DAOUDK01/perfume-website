import { getUsersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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
    if (!oid) return Response.json({ error: "Invalid user id" }, { status: 400 });

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ _id: oid });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({
      success: true,
      user: { ...user, _id: user._id?.toString?.() || user._id },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const oid = toObjectId(params?.id);
    if (!oid) return Response.json({ error: "Invalid user id" }, { status: 400 });

    const body = await request.json();
    const update = {};

    if ("name" in (body || {})) {
      const name = String(body.name || "").trim();
      if (!name) return Response.json({ error: "Name is required" }, { status: 400 });
      update.name = name;
    }

    if ("email" in (body || {})) {
      const email = String(body.email || "").trim();
      if (!email) return Response.json({ error: "Email is required" }, { status: 400 });
      update.email = email.toLowerCase();
    }

    if ("role" in (body || {})) {
      update.role = String(body.role || "").trim() || "admin";
    }

    update.updatedAt = new Date();

    const usersCollection = await getUsersCollection();
    const result = await usersCollection.updateOne(
      { _id: oid },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const oid = toObjectId(params?.id);
    if (!oid) return Response.json({ error: "Invalid user id" }, { status: 400 });

    const usersCollection = await getUsersCollection();
    const result = await usersCollection.deleteOne({ _id: oid });
    if (result.deletedCount === 0) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

