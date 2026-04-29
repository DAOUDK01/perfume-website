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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();
    const includeHidden = searchParams.get("includeHidden") === "true";
    const normalizedCategory = normalizeCategoryValue(category);

    // TEMPORARY: Ignore filters if we are debugging empty results
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { tagline: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } },
      ];
    }
    if (category) {
      if (normalizedCategory === "women") {
        filter.category = {
          $regex: "women|woman|female|lady|for her",
          $options: "i",
        };
      } else if (normalizedCategory === "men") {
        filter.category = {
          $regex: "men|man|male|for him",
          $options: "i",
        };
      } else if (normalizedCategory === "uni") {
        filter.category = {
          $regex: "uni|unisex",
          $options: "i",
        };
      } else {
        filter.category = { $regex: category, $options: "i" };
      }
    }

    console.log(
      "Fetching products. Filter active:",
      Object.keys(filter).length > 0,
    );

    // Connect to databases with timeout protection - separate timing for better diagnostics
    const startTime = Date.now();
    const [localDbResult, atlasDbResult] = await Promise.allSettled([
      safeDbOperation(
        () => connectToLocalDb(),
        {
          client: null,
          db: {
            collection: () => ({
              find: () => ({ sort: () => ({ toArray: async () => [] }) }),
            }),
          },
        },
        5000,
        "Local DB connection",
      ),
      safeDbOperation(
        () => connectToAtlasDb(),
        {
          client: null,
          db: {
            collection: () => ({
              find: () => ({ sort: () => ({ toArray: async () => [] }) }),
            }),
          },
        },
        8000,
        "Atlas DB connection",
      ),
    ]);

    const connectionTime = Date.now() - startTime;
    console.log(
      `[Products API] Database connections completed in ${connectionTime}ms`,
    );

    const { db: localDb } =
      localDbResult.status === "fulfilled" ? localDbResult.value : { db: null };
    const { db: atlasDb } =
      atlasDbResult.status === "fulfilled" ? atlasDbResult.value : { db: null };

    // Fetch products with individual timeouts and fallbacks
    const [localProducts, atlasProducts, atlasProductSingular] =
      await Promise.allSettled([
        safeDbOperation(
          () =>
            localDb
              ?.collection("products")
              .find(filter)
              .sort({ createdAt: -1 })
              .toArray() || Promise.resolve([]),
          [],
          4000,
          "Local products fetch",
        ),
        safeDbOperation(
          () =>
            atlasDb
              ?.collection("products")
              .find(filter)
              .sort({ createdAt: -1 })
              .toArray() || Promise.resolve([]),
          [],
          6000,
          "Atlas products fetch",
        ),
        safeDbOperation(
          () =>
            atlasDb
              ?.collection("product")
              .find(filter)
              .sort({ createdAt: -1 })
              .toArray() || Promise.resolve([]),
          [],
          6000,
          "Atlas product (singular) fetch",
        ),
      ]);

    const localResult =
      localProducts.status === "fulfilled" ? localProducts.value : [];
    const atlasResult =
      atlasProducts.status === "fulfilled" ? atlasProducts.value : [];
    const atlasSingularResult =
      atlasProductSingular.status === "fulfilled"
        ? atlasProductSingular.value
        : [];

    console.log(
      `[Products API] Counts - Local: ${localResult.length}, Atlas (products): ${atlasResult.length}, Atlas (product): ${atlasSingularResult.length}`,
    );

    // Combine all found products
    const combinedProducts = [
      ...localResult,
      ...atlasResult,
      ...atlasSingularResult,
    ];

    // Deduplicate and normalize
    const uniqueProducts = Array.from(
      new Map(
        combinedProducts.map((p) => {
          const productId =
            p.id || p._id?.toString() || `temp-${Math.random()}`;
          const stock = Number(p.stock);
          return [
            productId,
            {
              ...p,
              id: productId,
              _id: p._id?.toString?.() || p._id,
              category: normalizeCategoryValue(String(p.category || "")),
              stock: Number.isFinite(stock) ? stock : 0,
              manualOutOfStock: parseBoolean(p.manualOutOfStock, false),
              showOnWebsite: parseBoolean(p.showOnWebsite, true),
            },
          ];
        }),
      ).values(),
    );

    const visibleProducts = includeHidden
      ? uniqueProducts
      : uniqueProducts.filter((product) => product.showOnWebsite !== false);

    console.log(
      `[Products API] Total unique products to return: ${visibleProducts.length}`,
    );

    return NextResponse.json({
      success: true,
      count: visibleProducts.length,
      products: visibleProducts,
      debug: {
        local: localResult.length,
        atlas_products: atlasResult.length,
        atlas_product: atlasSingularResult.length,
        connection_status: {
          local: localDbResult.status,
          atlas: atlasDbResult.status,
        },
      },
    });
  } catch (error) {
    console.error("[Products API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      tagline = "",
      price,
      stock = 0,
      manualOutOfStock = false,
      showOnWebsite = true,
      category = "",
      image = "",
      images = [],
      topNotes = [],
      heartNotes = [],
      baseNotes = [],
      fullDescription = "",
    } = body || {};

    if (!id || typeof id !== "string" || !id.trim()) {
      return NextResponse.json(
        { error: "Product id is required" },
        { status: 400 },
      );
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 },
      );
    }
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 },
      );
    }
    const parsedStock = Number(stock);
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      return NextResponse.json(
        { error: "Valid stock is required" },
        { status: 400 },
      );
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localExists, atlasExists, atlasExistsSingular] = await Promise.all([
      localDb.collection("products").findOne({ id: id.trim() }),
      atlasDb.collection("products").findOne({ id: id.trim() }),
      atlasDb.collection("product").findOne({ id: id.trim() }),
    ]);

    if (localExists || atlasExists || atlasExistsSingular) {
      return NextResponse.json(
        { success: false, error: "A product with this id already exists" },
        { status: 409 },
      );
    }

    const product = {
      id: id.trim(),
      name: name.trim(),
      tagline: typeof tagline === "string" ? tagline.trim() : "",
      price: parsedPrice,
      stock: parsedStock,
      category: normalizeCategoryValue(String(category || "")),
      image: typeof image === "string" ? image.trim() : "",
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      topNotes: Array.isArray(topNotes) ? topNotes.filter(Boolean) : [],
      heartNotes: Array.isArray(heartNotes) ? heartNotes.filter(Boolean) : [],
      baseNotes: Array.isArray(baseNotes) ? baseNotes.filter(Boolean) : [],
      fullDescription:
        typeof fullDescription === "string" ? fullDescription.trim() : "",
      manualOutOfStock: parseBoolean(manualOutOfStock, false),
      showOnWebsite: parseBoolean(showOnWebsite, true),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection("products").insertOne(product),
      atlasDb.collection("products").insertOne(product),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        localId: localResult.insertedId?.toString?.(),
        atlasId: atlasResult.insertedId?.toString?.(),
      },
      { status: 201 },
    );
  } catch (error) {
    // Handle duplicate key if user added a unique index later
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "A product with this id already exists" },
        { status: 409 },
      );
    }
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
