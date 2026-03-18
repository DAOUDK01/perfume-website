import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

function toTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function getOrderKey(order) {
  const id = order?._id?.toString?.() || order?._id;
  if (id) return String(id);

  return [
    String(order?.email || ""),
    String(order?.customerName || ""),
    String(order?.createdAt || ""),
    String(order?.totalAmount || ""),
  ].join("|");
}

export async function GET() {
  try {
    console.log("Fetching admin metrics...");
    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();
    console.log("Connected to both DBs for metrics");

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const nextYearStart = new Date(now.getFullYear() + 1, 0, 1);

    const [
      localProductsCount,
      localOrdersCount,
      localRevenueAgg,
      localMonthlyRevenueAgg,
      localYearlyRevenueAgg,
      localNewOrdersCount,
      localUsersCount,
      localRecentOrders,
    ] = await Promise.all([
      localDb.collection("products").countDocuments({}),
      localDb.collection("orders").countDocuments({}),
      localDb
        .collection("orders")
        .aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }])
        .toArray(),
      localDb
        .collection("orders")
        .aggregate([
          {
            $match: {
              createdAt: { $gte: monthStart, $lt: nextMonthStart },
            },
          },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ])
        .toArray(),
      localDb
        .collection("orders")
        .aggregate([
          {
            $match: {
              createdAt: { $gte: yearStart, $lt: nextYearStart },
            },
          },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ])
        .toArray(),
      localDb.collection("orders").countDocuments({ status: "new" }),
      localDb.collection("users").countDocuments({}),
      localDb
        .collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    const [
      atlasProductsCount,
      atlasOrdersCount,
      atlasRevenueAgg,
      atlasMonthlyRevenueAgg,
      atlasYearlyRevenueAgg,
      atlasNewOrdersCount,
      atlasUsersCount,
      atlasRecentOrders,
    ] = await Promise.all([
      atlasDb.collection("products").countDocuments({}),
      atlasDb.collection("orders").countDocuments({}),
      atlasDb
        .collection("orders")
        .aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }])
        .toArray(),
      atlasDb
        .collection("orders")
        .aggregate([
          {
            $match: {
              createdAt: { $gte: monthStart, $lt: nextMonthStart },
            },
          },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ])
        .toArray(),
      atlasDb
        .collection("orders")
        .aggregate([
          {
            $match: {
              createdAt: { $gte: yearStart, $lt: nextYearStart },
            },
          },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ])
        .toArray(),
      atlasDb.collection("orders").countDocuments({ status: "new" }),
      atlasDb.collection("users").countDocuments({}),
      atlasDb
        .collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    const productsCount = localProductsCount + atlasProductsCount;
    const ordersCount = localOrdersCount + atlasOrdersCount;
    const revenue =
      (localRevenueAgg?.[0]?.total || 0) + (atlasRevenueAgg?.[0]?.total || 0);
    const monthlyRevenue =
      (localMonthlyRevenueAgg?.[0]?.total || 0) +
      (atlasMonthlyRevenueAgg?.[0]?.total || 0);
    const yearlyRevenue =
      (localYearlyRevenueAgg?.[0]?.total || 0) +
      (atlasYearlyRevenueAgg?.[0]?.total || 0);
    const newOrdersCount = localNewOrdersCount + atlasNewOrdersCount;
    const usersCount = localUsersCount + atlasUsersCount;

    // Combine and deduplicate recent orders (local + atlas), then take latest 5.
    const dedupedRecentMap = new Map();
    for (const order of [...localRecentOrders, ...atlasRecentOrders]) {
      const key = getOrderKey(order);
      const existing = dedupedRecentMap.get(key);

      if (!existing) {
        dedupedRecentMap.set(key, order);
        continue;
      }

      if (
        toTime(order?.updatedAt || order?.createdAt) >=
        toTime(existing?.updatedAt || existing?.createdAt)
      ) {
        dedupedRecentMap.set(key, order);
      }
    }

    const combinedRecentOrders = Array.from(dedupedRecentMap.values())
      .sort((a, b) => toTime(b?.createdAt) - toTime(a?.createdAt))
      .slice(0, 5);

    console.log("Metrics built successfully");

    return NextResponse.json({
      success: true,
      metrics: {
        productsCount,
        ordersCount,
        usersCount,
        revenue,
        monthlyRevenue,
        yearlyRevenue,
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
      { status: 500 },
    );
  }
}
