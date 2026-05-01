import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

function toTime(value) {
  const time = new Date(value || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function toAmount(value) {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
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

function dedupeOrders(orders) {
  const deduped = new Map();

  for (const order of orders) {
    const key = getOrderKey(order);
    const existing = deduped.get(key);

    if (!existing) {
      deduped.set(key, order);
      continue;
    }

    if (
      toTime(order?.updatedAt || order?.createdAt) >=
      toTime(existing?.updatedAt || existing?.createdAt)
    ) {
      deduped.set(key, order);
    }
  }

  return Array.from(deduped.values());
}

function isInRange(value, start, end) {
  const time = toTime(value);
  return time >= start.getTime() && time < end.getTime();
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
      localUsersCount,
      localRecentOrders,
      localAllOrders,
    ] = await Promise.all([
      localDb.collection("products").countDocuments({}),
      localDb.collection("users").countDocuments({}),
      localDb
        .collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      localDb.collection("orders").find({}).toArray(),
    ]);

    const [
      atlasProductsCount,
      atlasUsersCount,
      atlasRecentOrders,
      atlasAllOrders,
    ] = await Promise.all([
      atlasDb.collection("products").countDocuments({}),
      atlasDb.collection("users").countDocuments({}),
      atlasDb
        .collection("orders")
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
      atlasDb.collection("orders").find({}).toArray(),
    ]);

    const productsCount = localProductsCount + atlasProductsCount;
    const usersCount = localUsersCount + atlasUsersCount;
    const combinedOrders = dedupeOrders([...localAllOrders, ...atlasAllOrders]);
    const ordersCount = combinedOrders.length;
    const newOrdersCount = combinedOrders.filter(
      (order) => String(order?.status || "").toLowerCase() === "new",
    ).length;
    const revenue = combinedOrders.reduce(
      (sum, order) => sum + toAmount(order?.totalAmount),
      0,
    );
    const monthlyRevenue = combinedOrders.reduce((sum, order) => {
      if (!isInRange(order?.createdAt, monthStart, nextMonthStart)) {
        return sum;
      }

      return sum + toAmount(order?.totalAmount);
    }, 0);
    const yearlyRevenue = combinedOrders.reduce((sum, order) => {
      if (!isInRange(order?.createdAt, yearStart, nextYearStart)) {
        return sum;
      }

      return sum + toAmount(order?.totalAmount);
    }, 0);

    const combinedRecentOrders = dedupeOrders([
      ...localRecentOrders,
      ...atlasRecentOrders,
    ])
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
