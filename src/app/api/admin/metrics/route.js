import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Fetching admin metrics...");
    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();
    console.log("Connected to both DBs for metrics");

    const [
      localProductsCount,
      localOrdersCount,
      localRevenueAgg,
      localNewOrdersCount,
      localUsersCount,
      localRecentOrders,
    ] = await Promise.all([
      localDb.collection('products').countDocuments({}),
      localDb.collection('orders').countDocuments({}),
      localDb.collection('orders')
        .aggregate([
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ])
        .toArray(),
      localDb.collection('orders').countDocuments({ status: "new" }),
      localDb.collection('users').countDocuments({}),
      localDb.collection('orders')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    const [
      atlasProductsCount,
      atlasOrdersCount,
      atlasRevenueAgg,
      atlasNewOrdersCount,
      atlasUsersCount,
      atlasRecentOrders,
    ] = await Promise.all([
      atlasDb.collection('products').countDocuments({}),
      atlasDb.collection('orders').countDocuments({}),
      atlasDb.collection('orders')
        .aggregate([
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ])
        .toArray(),
      atlasDb.collection('orders').countDocuments({ status: "new" }),
      atlasDb.collection('users').countDocuments({}),
      atlasDb.collection('orders')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    const productsCount = localProductsCount + atlasProductsCount;
    const ordersCount = localOrdersCount + atlasOrdersCount;
    const revenue = (localRevenueAgg?.[0]?.total || 0) + (atlasRevenueAgg?.[0]?.total || 0);
    const newOrdersCount = localNewOrdersCount + atlasNewOrdersCount;
    const usersCount = localUsersCount + atlasUsersCount;

    // Combine recent orders and sort them by createdAt to get the 5 most recent overall
    const combinedRecentOrders = [...localRecentOrders, ...atlasRecentOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    console.log("Metrics built successfully");

    return NextResponse.json({
      success: true,
      metrics: {
        productsCount,
        ordersCount,
        usersCount,
        revenue,
        newOrdersCount,
      },
      recentOrders: combinedRecentOrders.map((o) => ({
        ...o,
        _id: o._id?.toString?.() || o._id,
      })),
    });
  } catch (error) {
    console.error("Error building admin metrics:", error);
    return NextResponse.json(
      { error: "Failed to load admin metrics" },
      { status: 500 }
    );
  }
}

