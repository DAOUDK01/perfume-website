import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const SETTINGS_ID = "global";

export async function GET() {
  try {
    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const localDoc = await localDb
      .collection("settings")
      .findOne({ _id: SETTINGS_ID });
    const atlasDoc = await atlasDb
      .collection("settings")
      .findOne({ _id: SETTINGS_ID });

    const doc = localDoc || atlasDoc;

    return NextResponse.json({
      success: true,
      settings: doc || {
        _id: SETTINGS_ID,
        storeName: "e'eora",
        supportEmail: "support@example.com",
        currency: "PKR",
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { storeName, supportEmail, currency } = body || {};

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const update = {};
    if (typeof storeName === "string") update.storeName = storeName.trim();
    if (typeof supportEmail === "string")
      update.supportEmail = supportEmail.trim();
    if (typeof currency === "string") update.currency = currency.trim();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection("settings").updateOne(
        { _id: SETTINGS_ID },
        {
          $set: {
            _id: SETTINGS_ID,
            ...update,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      ),
      atlasDb.collection("settings").updateOne(
        { _id: SETTINGS_ID },
        {
          $set: {
            _id: SETTINGS_ID,
            ...update,
            updatedAt: new Date(),
          },
        },
        { upsert: true },
      ),
    ]);

    return NextResponse.json({
      success: true,
      upsertedId:
        localResult.upsertedId || atlasResult.upsertedId || SETTINGS_ID,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
