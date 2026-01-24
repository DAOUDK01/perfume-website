import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Check if the body is readable and not empty
    let body;
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch (e) {
      body = {};
    }

    const { email, name, message } = body;

    if (!email || !String(email).trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    // If message is present, it's a contact form submission
    if (message) {
      const messagesCollectionLocal = localDb.collection("messages");
      const messagesCollectionAtlas = atlasDb.collection("messages");
      
      const doc = {
        name: name ? String(name).trim() : "",
        email: String(email).trim().toLowerCase(),
        message: String(message).trim(),
        createdAt: new Date(),
        status: "unread"
      };

      const [localResult, atlasResult] = await Promise.all([
        messagesCollectionLocal.insertOne(doc),
        messagesCollectionAtlas.insertOne(doc)
      ]);

      return NextResponse.json(
        { 
          success: true, 
          message: "Message sent successfully", 
          localId: localResult.insertedId,
          atlasId: atlasResult.insertedId
        },
        { status: 201 }
      );
    }

    // Otherwise, it's a newsletter subscription
    const contactsCollectionLocal = localDb.collection("contacts");
    const contactsCollectionAtlas = atlasDb.collection("contacts");

    const emailLower = String(email).trim().toLowerCase();

    // Check if email already exists to prevent duplicates in both
    const [localExisting, atlasExisting] = await Promise.all([
      contactsCollectionLocal.findOne({ email: emailLower }),
      contactsCollectionAtlas.findOne({ email: emailLower })
    ]);

    if (localExisting || atlasExisting) {
      return NextResponse.json(
        { success: true, message: "Email already subscribed." },
        { status: 200 }
      ); 
    }

    const contactDoc = {
      email: emailLower,
      subscribedAt: new Date(),
    };

    const [localRes, atlasRes] = await Promise.all([
      contactsCollectionLocal.insertOne(contactDoc),
      contactsCollectionAtlas.insertOne(contactDoc)
    ]);

    return NextResponse.json(
      { 
        success: true, 
        message: "Contact subscribed successfully", 
        localId: localRes.insertedId?.toString?.(),
        atlasId: atlasRes.insertedId?.toString?.()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}