import { getProductsCollection } from "@/lib/mongodb";

function parseIdParam(params) {
  const id = params?.id;
  if (!id || typeof id !== "string") return null;
  return id;
}

export async function GET(_request, { params }) {
  try {
    const id = parseIdParam(params);
    if (!id) {
      return Response.json({ error: "Invalid product id" }, { status: 400 });
    }

    const productsCollection = await getProductsCollection();
    const product = await productsCollection.findOne({ id });

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      product: { ...product, _id: product._id?.toString?.() || product._id },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const id = parseIdParam(params);
    if (!id) {
      return Response.json({ error: "Invalid product id" }, { status: 400 });
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
          return Response.json(
            { error: "Valid price is required" },
            { status: 400 }
          );
        }
        update.price = parsed;
        continue;
      }
      if (key === "stock") {
        const parsed = Number(val);
        if (!Number.isFinite(parsed) || parsed < 0) {
          return Response.json(
            { error: "Valid stock is required" },
            { status: 400 }
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

    const productsCollection = await getProductsCollection();
    const result = await productsCollection.updateOne(
      { id },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return Response.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const id = parseIdParam(params);
    if (!id) {
      return Response.json({ error: "Invalid product id" }, { status: 400 });
    }

    const productsCollection = await getProductsCollection();
    const result = await productsCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return Response.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

