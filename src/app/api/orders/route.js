import { getOrdersCollection } from "@/lib/mongodb";

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

    const ordersCollection = await getOrdersCollection();
    const orders = await ordersCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      orders: orders.map((o) => ({
        ...o,
        _id: o._id?.toString?.() || o._id,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, items, address } = body;

    if (!name || !name.trim()) {
      return Response.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!address || !address.trim()) {
      return Response.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity || 0);
    }, 0);

    if (totalAmount <= 0) {
      return Response.json(
        { error: "Order total must be greater than zero" },
        { status: 400 }
      );
    }

    // Prepare order document
    const order = {
      customerName: name.trim(),
      email: email.trim(),
      address: address.trim(),
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into MongoDB
    const ordersCollection = await getOrdersCollection();
    const result = await ordersCollection.insertOne(order);

    return Response.json(
      {
        success: true,
        message: "Order saved successfully",
        orderId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving order:", error);
    return Response.json(
      { error: "Failed to save order. Please try again." },
      { status: 500 }
    );
  }
}
