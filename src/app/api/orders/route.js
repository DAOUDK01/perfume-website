import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

/**
 * Sends order data to n8n webhook (non-blocking)
 * This function fires and forgets - it won't block order creation if n8n is down
 */
async function sendToN8nWebhook(orderData) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  
  // Skip if webhook URL is not configured
  if (!webhookUrl) {
    console.log("N8N_WEBHOOK_URL not configured, skipping webhook");
    return;
  }

  // Fire and forget - don't await, don't block
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  }).catch((error) => {
    // Log errors but don't throw - order creation should succeed even if webhook fails
    console.error("Failed to send order to n8n webhook:", error);
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const status = (searchParams.get("status") || "").trim();

    const filter = {};
    if (q) {
      filter.$or = [
        { customerName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ];
    }
    if (status) filter.status = status;

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const localOrders = await localDb.collection('orders')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const atlasOrders = await atlasDb.collection('orders')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    const combinedOrders = [...localOrders, ...atlasOrders];

    return NextResponse.json({
      success: true,
      orders: combinedOrders.map((o) => ({
        ...o,
        _id: o._id?.toString?.() || o._id,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, items, address, phone } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const totalAmount = items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );

    const orderData = { 
      customerName: name.trim(),
      email: email.trim().toLowerCase(),
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount,
      shippingAddress: address.trim(),
      phone: phone?.trim() || "",
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection('orders').insertOne(orderData),
      atlasDb.collection('orders').insertOne(orderData)
    ]);

    // Send order data to n8n webhook (non-blocking)
    sendToN8nWebhook({
      ...orderData,
      orderId: localResult.insertedId || atlasResult.insertedId,
    });

    return NextResponse.json(
      { 
        success: true, 
        localOrderId: localResult.insertedId, 
        atlasOrderId: atlasResult.insertedId 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
