import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

function extractProductId(item) {
  if (!item) return "";
  if (item.productId) return String(item.productId);
  if (typeof item.id === "string") return item.id.replace(/::tester$/, "");
  return String(item.id || "");
}

function toQuantity(value) {
  const quantity = Number(value);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
}

function buildStockMap(items = []) {
  const stockMap = new Map();

  for (const item of items) {
    const productId = extractProductId(item);
    const quantity = toQuantity(item?.quantity || 1);
    if (!productId || !quantity) continue;
    stockMap.set(productId, (stockMap.get(productId) || 0) + quantity);
  }

  return stockMap;
}

async function decrementStockForCollection(collection, items = []) {
  const stockMap = buildStockMap(items);

  for (const [productId, quantity] of stockMap.entries()) {
    const product = await collection.findOne({ id: productId });
    if (!product) continue;

    const currentStock = Number(product.stock || 0);
    const nextStock = Math.max(0, currentStock - quantity);

    await collection.updateOne(
      { id: productId },
      { $set: { stock: nextStock, updatedAt: new Date() } },
    );
  }
}

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid)
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localOrder, atlasOrder] = await Promise.all([
      localDb.collection("orders").findOne({ _id: oid }),
      atlasDb.collection("orders").findOne({ _id: oid }),
    ]);

    const order = localOrder || atlasOrder;
    if (!order)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      order: { ...order, _id: order._id?.toString?.() || order._id },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid)
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    const body = await request.json();
    const status = typeof body?.status === "string" ? body.status.trim() : "";

    const allowed = [
      "new",
      "processing",
      "shipped",
      "delivered",
      "complete",
      "cancelled",
    ];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${allowed.join(", ")}` },
        { status: 400 },
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localOrder, atlasOrder] = await Promise.all([
      localDb.collection("orders").findOne({ _id: oid }),
      atlasDb.collection("orders").findOne({ _id: oid }),
    ]);
    const currentOrder = localOrder || atlasOrder;
    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const shouldDecrementStock =
      status === "complete" && currentOrder.status !== "complete";

    const [localResult, atlasResult] = await Promise.all([
      localDb
        .collection("orders")
        .updateOne({ _id: oid }, { $set: { status, updatedAt: new Date() } }),
      atlasDb
        .collection("orders")
        .updateOne({ _id: oid }, { $set: { status, updatedAt: new Date() } }),
    ]);

    if (localResult.matchedCount === 0 && atlasResult.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (shouldDecrementStock) {
      const orderItems = Array.isArray(currentOrder.items)
        ? currentOrder.items
        : [];
      await Promise.all([
        decrementStockForCollection(localDb.collection("products"), orderItems),
        decrementStockForCollection(localDb.collection("product"), orderItems),
        decrementStockForCollection(atlasDb.collection("products"), orderItems),
        decrementStockForCollection(atlasDb.collection("product"), orderItems),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid)
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection("orders").deleteOne({ _id: oid }),
      atlasDb.collection("orders").deleteOne({ _id: oid }),
    ]);

    if (localResult.deletedCount === 0 && atlasResult.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 },
    );
  }
}
