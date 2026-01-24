import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const localContent = await localDb.collection('content').find({}).toArray();
    const atlasContent = await atlasDb.collection('content').find({}).toArray();

    // Combine and deduplicate content based on page, section, and label
    const combinedContent = [...localContent, ...atlasContent];
    const uniqueContent = Array.from(
      new Map(
        combinedContent.map((item) => [`${item.page}-${item.section}-${item.label}`, item])
      ).values()
    );

    return NextResponse.json({ 
      success: true, 
      content: uniqueContent.map(item => ({
        ...item,
        _id: item._id?.toString?.() || item._id
      }))
    });
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, page, type, value, section } = body;

    if (!label || !value) {
      return NextResponse.json({ error: "Label and Value are required" }, { status: 400 });
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const contentData = {
      label,
      page: page || "General",
      section: section || "Main",
      type: type || "image",
      value,
      createdAt: new Date(),
    };

    const localResult = await localDb.collection('content').insertOne(contentData);
    const atlasResult = await atlasDb.collection('content').insertOne(contentData);

    return NextResponse.json({ 
      success: true, 
      localId: localResult.insertedId, 
      atlasId: atlasResult.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create content:", error);
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}
