import { getOrdersCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export async function GET(_request, { params }) {
  try {
    const oid = toObjectId(params?.id);
    if (!oid) return Response.json({ error: "Invalid order id" }, { status: 400 });

    const ordersCollection = await getOrdersCollection();
    const order = await ordersCollection.findOne({ _id: oid });
    if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

    return Response.json({
      success: true,
      order: { ...order, _id: order._id?.toString?.() || order._id },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return Response.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const oid = toObjectId(params?.id);
    if (!oid) return Response.json({ error: "Invalid order id" }, { status: 400 });

    const body = await request.json();
    const status = typeof body?.status === "string" ? body.status.trim() : "";

    const allowed = ["new", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return Response.json(
        { error: `Invalid status. Allowed: ${allowed.join(", ")}` },
        { status: 400 }
      );
    }

    const ordersCollection = await getOrdersCollection();
    const result = await ordersCollection.updateOne(
      { _id: oid },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return Response.json({ error: "Failed to update order" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const oid = toObjectId(params?.id);
    if (!oid) return Response.json({ error: "Invalid order id" }, { status: 400 });

    const ordersCollection = await getOrdersCollection();
    const result = await ordersCollection.deleteOne({ _id: oid });
    if (result.deletedCount === 0) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return Response.json({ error: "Failed to delete order" }, { status: 500 });
  }
}

