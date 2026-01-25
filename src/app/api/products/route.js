import { connectToLocalDb, connectToAtlasDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "").trim();

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

    console.log("Fetching products with filter:", filter);

    const [localProducts, atlasProducts] = await Promise.all([
      localDb.collection('products').find(filter).sort({ createdAt: -1 }).toArray(),
      atlasDb.collection('products').find(filter).sort({ createdAt: -1 }).toArray()
    ]);

    console.log(`Found ${localProducts.length} local products and ${atlasProducts.length} atlas products`);

    // Combine and deduplicate products based on 'id' or '_id'
    const combinedProducts = [...localProducts, ...atlasProducts];
    const uniqueProducts = Array.from(
      new Map(
        combinedProducts.map((p) => {
          const productId = p.id || p._id?.toString() || String(Math.random());
          return [productId, { ...p, id: productId }];
        })
      ).values()
    );

    console.log(`Total unique products: ${uniqueProducts.length}`);

    return NextResponse.json({
      success: true,
      products: uniqueProducts.map((p) => ({
        ...p,
        _id: p._id?.toString?.() || p._id,
      })),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
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

    const [localExists, atlasExists] = await Promise.all([
      localDb.collection('products').findOne({ id: id.trim() }),
      atlasDb.collection('products').findOne({ id: id.trim() })
    ]);

    if (localExists || atlasExists) {
      return NextResponse.json(
        { error: "A product with this id already exists in one or both databases" },
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
        localProductId: localResult.insertedId?.toString?.(),
        atlasProductId: atlasResult.insertedId?.toString?.(),
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

