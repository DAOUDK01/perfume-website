import { getContentCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await getContentCollection();
    const content = await collection.find({}).toArray();
    return NextResponse.json({ content });
  } catch (error) {
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

    const collection = await getContentCollection();
    const result = await collection.insertOne({
      label,
      page: page || "General",
      section: section || "Main",
      type: type || "image",
      value,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}
