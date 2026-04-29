import {
  connectToLocalDb,
  connectToAtlasDb,
  safeDbOperation,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";

function parseBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off"].includes(normalized)) return false;
  }
  return fallback;
}

function normalizeProduct(product) {
  if (!product) return null;

  const stock = Number(product.stock);
  return {
    ...product,
    _id: product._id?.toString?.() || product._id,
    category: normalizeCategoryValue(String(product.category || "")),
    stock: Number.isFinite(stock) ? stock : 0,
    manualOutOfStock: parseBoolean(product.manualOutOfStock, false),
    showOnWebsite: parseBoolean(product.showOnWebsite, true),
  };
}

function normalizeProductId(value) {
  let next = String(value || "").trim();

  for (let index = 0; index < 3; index += 1) {
    try {
      const decoded = decodeURIComponent(next);
      if (decoded === next) break;
      next = decoded;
    } catch {
      break;
    }
  }

  return next;
}

function normalizeCategoryValue(value = "") {
  const raw = typeof value === "string" ? value.trim() : "";
  const category = raw.toLowerCase();

  if (
    category.includes("women") ||
    category.includes("woman") ||
    category.includes("female") ||
    category.includes("lady") ||
    category.includes("for her")
  ) {
    return "women";
  }

  if (
    category.includes("men") ||
    category.includes("man") ||
    category.includes("male") ||
    category.includes("for him")
  ) {
    return "men";
  }

  if (category.includes("uni") || category.includes("unisex")) {
    return "uni";
  }

  return raw;
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const normalizedId = normalizeProductId(id);
    if (!normalizedId) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 },
      );
    }

    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("includeHidden") === "true";

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

    async function findProduct(db, label) {
      if (!db) return null;

      const collections = ["products", "product"];
      for (const collectionName of collections) {
        const found = await safeDbOperation(
          () => db.collection(collectionName).findOne({ id: normalizedId }),
          null,
          collectionName === "products" ? 4000 : 3000,
          `${label} ${collectionName} lookup`,
        );
        if (found) return found;
      }

      return null;
    }

    const [localResult, atlasResult] = await Promise.allSettled([
      findProduct(localDb, "Local product"),
      findProduct(atlasDb, "Atlas product"),
    ]);

    const localProduct =
      localResult.status === "fulfilled" ? localResult.value : null;
    const atlasProduct =
      atlasResult.status === "fulfilled" ? atlasResult.value : null;
    const product = localProduct || atlasProduct;

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!includeHidden && parseBoolean(product.showOnWebsite, true) === false) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product: normalizeProduct(product),
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
    const normalizedId = normalizeProductId(id);
    if (!normalizedId) {
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
      "manualOutOfStock",
      "showOnWebsite",
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
      if (key === "category") {
        update.category = normalizeCategoryValue(String(val || ""));
        continue;
      }
      if (key === "manualOutOfStock" || key === "showOnWebsite") {
        update[key] = parseBoolean(val, key === "showOnWebsite");
        continue;
      }
      update[key] = typeof val === "string" ? val.trim() : val;
    }

    update.updatedAt = new Date();

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb
        .collection("products")
        .updateOne({ id: normalizedId }, { $set: update }),
      atlasDb
        .collection("products")
        .updateOne({ id: normalizedId }, { $set: update }),
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
    const normalizedId = normalizeProductId(id);
    if (!normalizedId) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 },
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection("products").deleteOne({ id: normalizedId }),
      atlasDb.collection("products").deleteOne({ id: normalizedId }),
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
