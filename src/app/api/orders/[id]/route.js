import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

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
    if (!oid) return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localOrder, atlasOrder] = await Promise.all([
      localDb.collection('orders').findOne({ _id: oid }),
      atlasDb.collection('orders').findOne({ _id: oid })
    ]);

    const order = localOrder || atlasOrder;
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      order: { ...order, _id: order._id?.toString?.() || order._id },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    const body = await request.json();
    const status = typeof body?.status === "string" ? body.status.trim() : "";

    const allowed = ["new", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${allowed.join(", ")}` },
        { status: 400 }
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection('orders').updateOne(
        { _id: oid },
        { $set: { status, updatedAt: new Date() } }
      ),
      atlasDb.collection('orders').updateOne(
        { _id: oid },
        { $set: { status, updatedAt: new Date() } }
      )
    ]);

    if (localResult.matchedCount === 0 && atlasResult.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const oid = toObjectId(id);
    if (!oid) return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection('orders').deleteOne({ _id: oid }),
      atlasDb.collection('orders').deleteOne({ _id: oid })
    ]);

    if (localResult.deletedCount === 0 && atlasResult.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}

