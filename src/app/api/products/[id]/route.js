import {
  connectToLocalDb,
  connectToAtlasDb,
  safeDbOperation,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 },
      );
    }

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

    // Find product with timeout protection
    const [localProduct, atlasProduct] = await Promise.allSettled([
      safeDbOperation(
        () =>
          localDb?.collection("products").findOne({ id }) ||
          Promise.resolve(null),
        null,
        4000,
        "Local product lookup",
      ),
      safeDbOperation(
        () =>
          atlasDb?.collection("products").findOne({ id }) ||
          Promise.resolve(null),
        null,
        6000,
        "Atlas product lookup",
      ),
    ]);

    const localResult =
      localProduct.status === "fulfilled" ? localProduct.value : null;
    const atlasResult =
      atlasProduct.status === "fulfilled" ? atlasProduct.value : null;
    const product = localResult || atlasResult;

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: { ...product, _id: product._id?.toString?.() || product._id },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const update = {};

    const allowed = [
      "name",
      "tagline",
      "price",
      "stock",
      "category",
      "image",
      "images",
      "topNotes",
      "heartNotes",
      "baseNotes",
      "fullDescription",
    ];

    for (const key of allowed) {
      if (!(key in (body || {}))) continue;
      const val = body[key];
      if (key === "price") {
        const parsed = Number(val);
        if (!Number.isFinite(parsed) || parsed <= 0) {
          return NextResponse.json(
            { error: "Valid price is required" },
            { status: 400 },
          );
        }
        update.price = parsed;
        continue;
      }
      if (key === "stock") {
        const parsed = Number(val);
        if (!Number.isFinite(parsed) || parsed < 0) {
          return NextResponse.json(
            { error: "Valid stock is required" },
            { status: 400 },
          );
        }
        update.stock = parsed;
        continue;
      }
      if (["topNotes", "heartNotes", "baseNotes", "images"].includes(key)) {
        update[key] = Array.isArray(val) ? val.filter(Boolean) : [];
        continue;
      }
      update[key] = typeof val === "string" ? val.trim() : val;
    }

    update.updatedAt = new Date();

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection("products").updateOne({ id }, { $set: update }),
      atlasDb.collection("products").updateOne({ id }, { $set: update }),
    ]);

    if (localResult.matchedCount === 0 && atlasResult.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully in both databases",
      local: localResult.modifiedCount,
      atlas: atlasResult.modifiedCount,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 },
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection("products").deleteOne({ id }),
      atlasDb.collection("products").deleteOne({ id }),
    ]);

    if (localResult.deletedCount === 0 && atlasResult.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully from both databases",
      local: localResult.deletedCount,
      atlas: atlasResult.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
