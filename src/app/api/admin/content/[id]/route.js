import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const objectId = new ObjectId(id);

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const localResult = await localDb.collection('content').deleteOne({ _id: objectId });
    const atlasResult = await atlasDb.collection('content').deleteOne({ _id: objectId });

    if (localResult.deletedCount === 0 && atlasResult.deletedCount === 0) {
      return NextResponse.json({ error: "Content not found in either database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, localDeletedCount: localResult.deletedCount, atlasDeletedCount: atlasResult.deletedCount });
  } catch (error) {
    console.error("Failed to delete content:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { label, page, section, value } = body;
    const objectId = new ObjectId(id);

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const updateData = { label, page, section, value, updatedAt: new Date() };

    const localResult = await localDb.collection('content').updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    const atlasResult = await atlasDb.collection('content').updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (localResult.matchedCount === 0 && atlasResult.matchedCount === 0) {
      return NextResponse.json({ error: "Content not found in either database" }, { status: 404 });
    }

    return NextResponse.json({ success: true, localMatchedCount: localResult.matchedCount, atlasMatchedCount: atlasResult.matchedCount });
  } catch (error) {
    console.error("Failed to update content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
