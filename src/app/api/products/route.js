import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();

    // TEMPORARY: Ignore filters if we are debugging empty results
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { tagline: { $regex: q, $options: "i" } },
        { id: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    console.log("Fetching products. Filter active:", Object.keys(filter).length > 0);

    // Try fetching from both 'products' and 'product' collections to be sure
    const [localProducts, atlasProducts, atlasProductSingular] = await Promise.all([
      localDb.collection('products').find(filter).sort({ createdAt: -1 }).toArray(),
      atlasDb.collection('products').find(filter).sort({ createdAt: -1 }).toArray(),
      atlasDb.collection('product').find(filter).sort({ createdAt: -1 }).toArray()
    ]);

    console.log(`[Products API] Counts - Local: ${localProducts.length}, Atlas (products): ${atlasProducts.length}, Atlas (product): ${atlasProductSingular.length}`);

    // Combine all found products
    const combinedProducts = [...localProducts, ...atlasProducts, ...atlasProductSingular];
    
    // Deduplicate and normalize
    const uniqueProducts = Array.from(
      new Map(
        combinedProducts.map((p) => {
          const productId = p.id || p._id?.toString() || `temp-${Math.random()}`;
          return [productId, { ...p, id: productId, _id: p._id?.toString?.() || p._id }];
        })
      ).values()
    );

    console.log(`[Products API] Total unique products to return: ${uniqueProducts.length}`);

    return NextResponse.json({
      success: true,
      count: uniqueProducts.length,
      products: uniqueProducts,
      debug: {
        local: localProducts.length,
        atlas_products: atlasProducts.length,
        atlas_product: atlasProductSingular.length
      }
    });
  } catch (error) {
    console.error("[Products API] Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch products",
      details: error.message 
    }, { status: 500 });
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
      category = "",
      image = "",
      images = [],
      topNotes = [],
      heartNotes = [],
      baseNotes = [],
      fullDescription = "",
    } = body || {};

    if (!id || typeof id !== "string" || !id.trim()) {
      return NextResponse.json({ error: "Product id is required" }, { status: 400 });
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
    }
    const parsedStock = Number(stock);
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      return NextResponse.json({ error: "Valid stock is required" }, { status: 400 });
    }

    const { db: localDb } = await connectToLocalDb();
    const { db: atlasDb } = await connectToAtlasDb();

    const [localExists, atlasExists, atlasExistsSingular] = await Promise.all([
      localDb.collection('products').findOne({ id: id.trim() }),
      atlasDb.collection('products').findOne({ id: id.trim() }),
      atlasDb.collection('product').findOne({ id: id.trim() })
    ]);

    if (localExists || atlasExists || atlasExistsSingular) {
      return NextResponse.json(
        { success: false, error: "A product with this id already exists" },
        { status: 409 }
      );
    }

    const product = {
      id: id.trim(),
      name: name.trim(),
      tagline: typeof tagline === "string" ? tagline.trim() : "",
      price: parsedPrice,
      stock: parsedStock,
      category: typeof category === "string" ? category.trim() : "",
      image: typeof image === "string" ? image.trim() : "",
      images: Array.isArray(images) ? images.filter(Boolean) : [],
      topNotes: Array.isArray(topNotes) ? topNotes.filter(Boolean) : [],
      heartNotes: Array.isArray(heartNotes) ? heartNotes.filter(Boolean) : [],
      baseNotes: Array.isArray(baseNotes) ? baseNotes.filter(Boolean) : [],
      fullDescription:
        typeof fullDescription === "string" ? fullDescription.trim() : "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [localResult, atlasResult] = await Promise.all([
      localDb.collection('products').insertOne(product),
      atlasDb.collection('products').insertOne(product)
    ]);

    return NextResponse.json(
      { 
        success: true, 
        message: "Product created successfully",
        localId: localResult.insertedId?.toString?.(),
        atlasId: atlasResult.insertedId?.toString?.(),
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate key if user added a unique index later
    if (error?.code === 11000) {
      return NextResponse.json(
        { error: "A product with this id already exists" },
        { status: 409 }
      );
    }
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

