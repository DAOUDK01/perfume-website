import {
  connectToLocalDb,
  connectToAtlasDb,
  safeDbOperation,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";

function toTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function getOrderKey(order) {
  const id = order?._id?.toString?.() || order?._id;
  if (id) return String(id);

  // Fallback signature for records without an _id
  return [
    String(order?.email || ""),
    String(order?.customerName || ""),
    String(order?.createdAt || ""),
    String(order?.totalAmount || ""),
  ].join("|");
}

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

    // Connect with timeout protection
    const [localDbResult, atlasDbResult] = await Promise.allSettled([
      safeDbOperation(
        () => connectToLocalDb(),
        { client: null, db: null },
        5000,
        "Local DB connection",
      ),
      safeDbOperation(
        () => connectToAtlasDb(),
        { client: null, db: null },
        8000,
        "Atlas DB connection",
      ),
    ]);

    const { db: localDb } =
      localDbResult.status === "fulfilled" ? localDbResult.value : { db: null };
    const { db: atlasDb } =
      atlasDbResult.status === "fulfilled" ? atlasDbResult.value : { db: null };

    // Fetch orders with timeout protection
    const [localOrders, atlasOrders] = await Promise.allSettled([
      safeDbOperation(
        () =>
          localDb
            ?.collection("orders")
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray() || Promise.resolve([]),
        [],
        4000,
        "Local orders fetch",
      ),
      safeDbOperation(
        () =>
          atlasDb
            ?.collection("orders")
            .find(filter)
            .sort({ createdAt: -1 })
            .toArray() || Promise.resolve([]),
        [],
        6000,
        "Atlas orders fetch",
      ),
    ]);

    const localResult =
      localOrders.status === "fulfilled" ? localOrders.value : [];
    const atlasResult =
      atlasOrders.status === "fulfilled" ? atlasOrders.value : [];

    const dedupedByKey = new Map();
    for (const order of [...localResult, ...atlasResult]) {
      const key = getOrderKey(order);
      const existing = dedupedByKey.get(key);

      if (!existing) {
        dedupedByKey.set(key, order);
        continue;
      }

      // Keep the most recently updated record when duplicates exist.
      const existingUpdated = toTime(
        existing?.updatedAt || existing?.createdAt,
      );
      const currentUpdated = toTime(order?.updatedAt || order?.createdAt);
      if (currentUpdated >= existingUpdated) {
        dedupedByKey.set(key, order);
      }
    }

    const combinedOrders = Array.from(dedupedByKey.values()).sort(
      (a, b) => toTime(b?.createdAt) - toTime(a?.createdAt),
    );

    return NextResponse.json({
      success: true,
      orders: combinedOrders.map((o) => ({
        ...o,
        _id: o._id?.toString?.() || o._id,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
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
        { status: 400 },
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 },
      );
    }

    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 },
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const totalAmount = items.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0,
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
      localDb.collection("orders").insertOne(orderData),
      atlasDb.collection("orders").insertOne(orderData),
    ]);

    // Send to n8n (async)
    sendToN8nWebhook({
      ...orderData,
      localId: localResult?.insertedId,
      atlasId: atlasResult?.insertedId,
    });

    return NextResponse.json(
      {
        success: true,
        localId: localResult?.insertedId,
        atlasId: atlasResult?.insertedId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
