import { getProductsCollection } from "@/lib/mongodb";

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

    const productsCollection = await getProductsCollection();
    const products = await productsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      products: products.map((p) => ({
        ...p,
        _id: p._id?.toString?.() || p._id,
      })),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
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
      return Response.json({ error: "Product id is required" }, { status: 400 });
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return Response.json({ error: "Product name is required" }, { status: 400 });
    }
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return Response.json({ error: "Valid price is required" }, { status: 400 });
    }
    const parsedStock = Number(stock);
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      return Response.json({ error: "Valid stock is required" }, { status: 400 });
    }

    const productsCollection = await getProductsCollection();

    const exists = await productsCollection.findOne({ id: id.trim() });
    if (exists) {
      return Response.json(
        { error: "A product with this id already exists" },
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

    const result = await productsCollection.insertOne(product);

    return Response.json(
      { success: true, productId: result.insertedId?.toString?.() },
      { status: 201 }
    );
  } catch (error) {
    // Handle duplicate key if user added a unique index later
    if (error?.code === 11000) {
      return Response.json(
        { error: "A product with this id already exists" },
        { status: 409 }
      );
    }
    console.error("Error creating product:", error);
    return Response.json({ error: "Failed to create product" }, { status: 500 });
  }
}

