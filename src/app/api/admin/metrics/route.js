import {
  getOrdersCollection,
  getProductsCollection,
  getUsersCollection,
} from "@/lib/mongodb";

export async function GET() {
  try {
    const ordersCollection = await getOrdersCollection();
    const productsCollection = await getProductsCollection();
    const usersCollection = await getUsersCollection();

    const [
      productsCount,
      ordersCount,
      revenueAgg,
      newOrdersCount,
      usersCount,
      recentOrders,
    ] =
      await Promise.all([
        productsCollection.countDocuments({}),
        ordersCollection.countDocuments({}),
        ordersCollection
          .aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ])
          .toArray(),
        ordersCollection.countDocuments({ status: "new" }),
        usersCollection.countDocuments({}),
        ordersCollection
          .find({})
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray(),
      ]);

    const revenue = revenueAgg?.[0]?.total || 0;

    return Response.json({
      success: true,
      metrics: {
        productsCount,
        ordersCount,
        usersCount,
        revenue,
        newOrdersCount,
      },
      recentOrders: recentOrders.map((o) => ({
        ...o,
        _id: o._id?.toString?.() || o._id,
      })),
    });
  } catch (error) {
    console.error("Error building admin metrics:", error);
    return Response.json(
      { error: "Failed to load admin metrics" },
      { status: 500 }
    );
  }
}

