import {
  connectToLocalDb,
  connectToAtlasDb,
  safeDbOperation,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";

function normalizeReview(review) {
  const rating = Number(review?.rating);

  return {
    id: String(
      review?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, rating)) : 1,
    comment: typeof review?.comment === "string" ? review.comment.trim() : "",
    createdAt: review?.createdAt
      ? new Date(review.createdAt).toISOString()
      : new Date().toISOString(),
  };
}

function summarizeReviews(reviews) {
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    return {
      reviewCount: 0,
      averageRating: 0,
    };
  }

  const total = reviews.reduce(
    (sum, item) => sum + Number(item.rating || 0),
    0,
  );

  return {
    reviewCount,
    averageRating: Number((total / reviewCount).toFixed(1)),
  };
}

async function findProduct(localDb, atlasDb, id) {
  const [localProduct, atlasProductsProduct, atlasProductSingular] =
    await Promise.allSettled([
      safeDbOperation(
        () =>
          localDb?.collection("products").findOne({ id }) ||
          Promise.resolve(null),
        null,
        4000,
        "Local review product lookup",
      ),
      safeDbOperation(
        () =>
          atlasDb?.collection("products").findOne({ id }) ||
          Promise.resolve(null),
        null,
        6000,
        "Atlas review product lookup",
      ),
      safeDbOperation(
        () =>
          atlasDb?.collection("product").findOne({ id }) ||
          Promise.resolve(null),
        null,
        6000,
        "Atlas singular review product lookup",
      ),
    ]);

  const localResult =
    localProduct.status === "fulfilled" ? localProduct.value : null;
  const atlasProductsResult =
    atlasProductsProduct.status === "fulfilled"
      ? atlasProductsProduct.value
      : null;
  const atlasSingularResult =
    atlasProductSingular.status === "fulfilled"
      ? atlasProductSingular.value
      : null;

  return localResult || atlasProductsResult || atlasSingularResult;
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 },
      );
    }

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

    const product = await findProduct(localDb, atlasDb, id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const reviews = Array.isArray(product.reviews)
      ? product.reviews.map(normalizeReview)
      : [];

    const summary = summarizeReviews(reviews);

    return NextResponse.json({
      success: true,
      reviews,
      reviewCount: summary.reviewCount,
      averageRating: summary.averageRating,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Invalid product id" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsedRating = Number(body?.rating);
    const comment =
      typeof body?.comment === "string" ? body.comment.trim() : "";

    if (
      !Number.isFinite(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    const review = normalizeReview({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      rating: parsedRating,
      comment,
      createdAt: new Date().toISOString(),
    });

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

    const updates = await Promise.allSettled([
      safeDbOperation(
        () =>
          localDb
            ?.collection("products")
            .updateOne(
              { id },
              { $push: { reviews: review }, $set: { updatedAt: new Date() } },
            ) || Promise.resolve({ matchedCount: 0 }),
        { matchedCount: 0 },
        4000,
        "Local review update",
      ),
      safeDbOperation(
        () =>
          atlasDb
            ?.collection("products")
            .updateOne(
              { id },
              { $push: { reviews: review }, $set: { updatedAt: new Date() } },
            ) || Promise.resolve({ matchedCount: 0 }),
        { matchedCount: 0 },
        6000,
        "Atlas review update",
      ),
      safeDbOperation(
        () =>
          atlasDb
            ?.collection("product")
            .updateOne(
              { id },
              { $push: { reviews: review }, $set: { updatedAt: new Date() } },
            ) || Promise.resolve({ matchedCount: 0 }),
        { matchedCount: 0 },
        6000,
        "Atlas singular review update",
      ),
    ]);

    const matchedCount = updates.reduce((sum, result) => {
      if (result.status !== "fulfilled") return sum;
      return sum + Number(result.value?.matchedCount || 0);
    }, 0);

    if (matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await findProduct(localDb, atlasDb, id);
    const reviews = Array.isArray(product?.reviews)
      ? product.reviews.map(normalizeReview)
      : [review];

    const summary = summarizeReviews(reviews);

    return NextResponse.json(
      {
        success: true,
        review,
        reviews,
        reviewCount: summary.reviewCount,
        averageRating: summary.averageRating,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 },
    );
  }
}
