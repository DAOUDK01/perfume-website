import { connectToDatabase } from "@/lib/mongodb";
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

    const { db } = await connectToDatabase();

    // If message is present, it's a contact form submission
    if (message) {
      const messagesCollection = db.collection("messages");
      const result = await messagesCollection.insertOne({
        name: name ? String(name).trim() : "",
        email: String(email).trim().toLowerCase(),
        message: String(message).trim(),
        createdAt: new Date(),
        status: "unread"
      });

      return NextResponse.json(
        { success: true, message: "Message sent successfully", id: result.insertedId },
        { status: 201 }
      );
    }

    // Otherwise, it's a newsletter subscription
    const contactsCollection = db.collection("contacts");

    // Check if email already exists to prevent duplicates
    const existingContact = await contactsCollection.findOne({ email: String(email).trim().toLowerCase() });
    if (existingContact) {
      return NextResponse.json(
        { success: true, message: "Email already subscribed." },
        { status: 200 }
      ); // Return 200 if already subscribed, no error
    }

    const result = await contactsCollection.insertOne({
      email: String(email).trim().toLowerCase(),
      subscribedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Contact subscribed successfully", contactId: result.insertedId?.toString?.() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact:", error);
    return NextResponse.json({ error: "Failed to save contact" }, { status: 500 });
  }
}