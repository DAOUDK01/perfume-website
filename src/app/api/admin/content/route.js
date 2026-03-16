import {
  connectToLocalDb,
  connectToAtlasDb,
  safeDbOperation,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Connect to databases with timeout protection
    const [localDbResult, atlasDbResult] = await Promise.allSettled([
      safeDbOperation(
        () => connectToLocalDb(),
        { client: null, db: null },
        5000,
        "Local DB connection (content)",
      ),
      safeDbOperation(
        () => connectToAtlasDb(),
        { client: null, db: null },
        8000,
        "Atlas DB connection (content)",
      ),
    ]);

    const { db: localDb } =
      localDbResult.status === "fulfilled" ? localDbResult.value : { db: null };
    const { db: atlasDb } =
      atlasDbResult.status === "fulfilled" ? atlasDbResult.value : { db: null };

    if (!localDb && !atlasDb) {
      return NextResponse.json(
        {
          success: false,
          content: [],
          error: "No database connection available",
        },
        { status: 503 },
      );
    }

    // Fetch content with timeout protection
    const [localContent, atlasContent] = await Promise.allSettled([
      safeDbOperation(
        () =>
          localDb?.collection("content").find({}).toArray() ||
          Promise.resolve([]),
        [],
        4000,
        "Local content fetch",
      ),
      safeDbOperation(
        () =>
          atlasDb?.collection("content").find({}).toArray() ||
          Promise.resolve([]),
        [],
        6000,
        "Atlas content fetch",
      ),
    ]);

    const localResult =
      localContent.status === "fulfilled" ? localContent.value : [];
    const atlasResult =
      atlasContent.status === "fulfilled" ? atlasContent.value : [];

    // Combine and deduplicate content based on page, section, and label
    const combinedContent = [...localResult, ...atlasResult];
    const uniqueContent = Array.from(
      new Map(
        combinedContent.map((item) => [
          `${item.page}-${item.section}-${item.label}`,
          item,
        ]),
      ).values(),
    );

    return NextResponse.json({
      success: true,
      content: uniqueContent.map((item) => ({
        ...item,
        _id: item._id?.toString?.() || item._id,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { label, page, type, value, section } = body;

    if (!label || !value) {
      return NextResponse.json(
        { error: "Label and Value are required" },
        { status: 400 },
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    if (!localDb && !atlasDb) {
      throw new Error("No database connection available");
    }

    const contentData = {
      label,
      page: page || "General",
      section: section || "Main",
      type: type || "image",
      value,
      createdAt: new Date(),
    };

    let localResult = null;
    if (localDb) {
      localResult = await localDb.collection("content").insertOne(contentData);
    }

    let atlasResult = null;
    if (atlasDb) {
      atlasResult = await atlasDb.collection("content").insertOne(contentData);
    }

    return NextResponse.json(
      {
        success: true,
        localId: localResult?.insertedId,
        atlasId: atlasResult?.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create content:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 },
    );
  }
}
