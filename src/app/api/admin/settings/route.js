import { getSettingsCollection } from "@/lib/mongodb";

const SETTINGS_ID = "global";

export async function GET() {
  try {
    const settingsCollection = await getSettingsCollection();
    const doc =
      (await settingsCollection.findOne({ _id: SETTINGS_ID })) || undefined;

    return Response.json({
      success: true,
      settings: doc || {
        _id: SETTINGS_ID,
        storeName: "e'eora",
        supportEmail: "support@example.com",
        currency: "USD",
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { storeName, supportEmail, currency } = body || {};

    const settingsCollection = await getSettingsCollection();

    const update = {};
    if (typeof storeName === "string") update.storeName = storeName.trim();
    if (typeof supportEmail === "string")
      update.supportEmail = supportEmail.trim();
    if (typeof currency === "string") update.currency = currency.trim();

    const result = await settingsCollection.updateOne(
      { _id: SETTINGS_ID },
      {
        $set: {
          _id: SETTINGS_ID,
          ...update,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return Response.json({
      success: true,
      upsertedId: result.upsertedId || SETTINGS_ID,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return Response.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

