"use client";

import type { Fragrance } from "@/data/fragrances";
import ScrollReveal from "@/components/ScrollReveal";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type ProductDetail = Fragrance & {
  category?: string;
};

type RelatedFragrance = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image?: string;
};

/* ✅ SAFE CART HELPER */
const getCart = (): any[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const isValidImageUrl = (value?: string) =>
  Boolean(
    value &&
    (value.startsWith("http") ||
      value.startsWith("/") ||
      value.startsWith("./")),
  );

const normalizeReview = (item: any, index: number): ReviewItem => ({
  id: String(item?.id ?? `review-${index}`),
  rating: Math.max(1, Math.min(5, Number(item?.rating) || 1)),
  comment: typeof item?.comment === "string" ? item.comment : "",
  createdAt: item?.createdAt
    ? new Date(item.createdAt).toISOString()
    : new Date().toISOString(),
});

const formatReviewDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function Stars({
  rating,
  sizeClass = "h-5 w-5",
}: {
  rating: number;
  sizeClass?: string;
}) {
  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating ${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const ActiveStar =
          rating >= starValue ? StarSolidIcon : StarOutlineIcon;

        return (
          <ActiveStar
            key={starValue}
            className={`${sizeClass} ${rating >= starValue ? "text-amber-500" : "text-gray-300"}`}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [fragrance, setFragrance] = useState<ProductDetail | null>(null);
  const [relatedFragrances, setRelatedFragrances] = useState<
    RelatedFragrance[]
  >([]);

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        const [productRes, listRes, reviewsRes] = await Promise.all([
          fetch(`/api/products/${encodeURIComponent(id)}`, {
            cache: "no-store",
          }),
          fetch("/api/products", { cache: "no-store" }),
          fetch(`/api/products/${encodeURIComponent(id)}/reviews`, {
            cache: "no-store",
          }),
        ]);

        const productData = await productRes.json().catch(() => ({}));
        const listData = await listRes.json().catch(() => ({}));
        const reviewsData = await reviewsRes.json().catch(() => ({}));

        if (cancelled) return;

        if (productRes.ok && productData.product) {
          const currentProduct: ProductDetail = {
            id: productData.product.id,
            name: productData.product.name,
            tagline: productData.product.tagline ?? "",
            price: Number(productData.product.price) || 0,
            image: productData.product.image ?? "",
            images:
              Array.isArray(productData.product.images) &&
              productData.product.images.length > 0
                ? productData.product.images
                : [productData.product.image ?? ""].filter(Boolean),
            topNotes: Array.isArray(productData.product.topNotes)
              ? productData.product.topNotes
              : [],
            heartNotes: Array.isArray(productData.product.heartNotes)
              ? productData.product.heartNotes
              : [],
            baseNotes: Array.isArray(productData.product.baseNotes)
              ? productData.product.baseNotes
              : [],
            fullDescription: productData.product.fullDescription ?? "",
            category: productData.product.category ?? "",
          };

          setFragrance(currentProduct);

          const allProducts =
            listRes.ok && Array.isArray(listData.products)
              ? listData.products
              : [];
          const currentCategory = (currentProduct.category || "")
            .toLowerCase()
            .trim();
          const nameTokens = currentProduct.name
            .toLowerCase()
            .split(/\s+/)
            .filter((token: string) => token.length > 3);

          const scoredRelated: Array<{
            score: number;
            product: RelatedFragrance;
          }> = allProducts
            .filter((item: any) => item?.id && item.id !== currentProduct.id)
            .map((item: any) => {
              const itemCategory = String(item?.category || "")
                .toLowerCase()
                .trim();
              const itemText =
                `${String(item?.name || "")} ${String(item?.tagline || "")}`.toLowerCase();

              let score = 0;
              if (currentCategory && itemCategory === currentCategory) {
                score += 4;
              }
              if (nameTokens.some((token) => itemText.includes(token))) {
                score += 1;
              }

              return {
                score,
                product: {
                  id: String(item.id),
                  name: String(item.name || "Unnamed"),
                  tagline: String(item.tagline || ""),
                  price: Number(item.price) || 0,
                  image: typeof item.image === "string" ? item.image : "",
                } as RelatedFragrance,
              };
            });

          const related = scoredRelated
            .sort((a, b) => b.score - a.score)
            .slice(0, 4)
            .map((entry) => entry.product);

          setRelatedFragrances(related);
        } else {
          setFragrance(null);
          setRelatedFragrances([]);
        }

        if (
          reviewsRes.ok &&
          reviewsData.success &&
          Array.isArray(reviewsData.reviews)
        ) {
          const normalizedReviews = reviewsData.reviews.map(normalizeReview);
          setReviews(normalizedReviews);
          setAverageRating(Number(reviewsData.averageRating) || 0);
          setReviewCount(
            Number(reviewsData.reviewCount) || normalizedReviews.length,
          );
        } else {
          setReviews([]);
          setAverageRating(0);
          setReviewCount(0);
        }
      } catch {
        if (cancelled) return;
        setFragrance(null);
        setRelatedFragrances([]);
        setReviews([]);
        setAverageRating(0);
        setReviewCount(0);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white  min-h-screen flex items-center justify-center">
        <p className="text-gray-500 ">Loading…</p>
      </div>
    );
  }

  if (!fragrance) {
    notFound();
  }

  /* ✅ ADD TO CART */
  const handleAddToCart = () => {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === fragrance.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...fragrance, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  /* ✅ BUY NOW */
  const handleBuyNow = () => {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === fragrance.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...fragrance, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/checkout");
  };

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => quantity > 1 && setQuantity((q) => q - 1);

  const orderedReviews = reviews.slice().sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime;
  });

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fragrance) return;

    if (selectedRating < 1 || selectedRating > 5) {
      setReviewMessage("Please select a star rating before submitting.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewMessage(null);

    try {
      const res = await fetch(
        `/api/products/${encodeURIComponent(fragrance.id)}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: selectedRating,
            comment: reviewText,
          }),
        },
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit review.");
      }

      const normalizedReviews = Array.isArray(data.reviews)
        ? data.reviews.map(normalizeReview)
        : [];

      setReviews(normalizedReviews);
      setAverageRating(Number(data.averageRating) || 0);
      setReviewCount(Number(data.reviewCount) || normalizedReviews.length);
      setSelectedRating(0);
      setReviewText("");
      setReviewMessage("Thank you. Your review has been added.");
    } catch (error: any) {
      setReviewMessage(error?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="bg-white  min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 ">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500  font-light">
          <Link href="/" className="hover:text-black ">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/fragrances" className="hover:text-black ">
            Collection
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black ">{fragrance.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* IMAGE */}
        <ScrollReveal>
          <div className="sticky top-24">
            <ProductImageCarousel
              images={
                fragrance.images || (fragrance.image ? [fragrance.image] : [])
              }
              name={fragrance.name}
            />
          </div>
        </ScrollReveal>

        {/* DETAILS */}
        <ScrollReveal delay={100}>
          <div className="space-y-10 animate-fade-in-up">
            <div>
              <p className="text-xs tracking-[0.2em] text-gray-500  mb-4 uppercase">
                EAU DE PARFUM
              </p>
              <h1 className="text-5xl md:text-6xl font-serif font-light mb-4 tracking-tight text-gray-900 ">
                {fragrance.name}
              </h1>
              <p className="text-xl text-gray-600  font-light italic">
                {fragrance.tagline}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <Stars rating={Math.round(averageRating)} sizeClass="h-5 w-5" />
                <p className="text-sm text-gray-600 font-light">
                  {reviewCount > 0
                    ? `${averageRating.toFixed(1)} average (${reviewCount} ${reviewCount === 1 ? "review" : "reviews"})`
                    : "No ratings yet"}
                </p>
              </div>
            </div>

            <div className="border-y border-gray-100  py-8">
              <p className="text-3xl font-light tracking-wide text-gray-900 ">
                Rs {fragrance.price}
              </p>
            </div>

            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase mb-4 font-medium text-gray-900 ">
                Description
              </h2>
              <p className="text-gray-600  font-light leading-relaxed text-lg">
                {fragrance.fullDescription}
              </p>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-6">
              <span className="text-sm uppercase tracking-widest text-gray-500 ">
                Quantity
              </span>
              <div className="flex items-center border border-gray-200  rounded-full px-2 py-1 hover:border-black  transition-colors duration-300">
                <button
                  onClick={handleDecrement}
                  className="w-10 h-10 flex items-center justify-center text-gray-500  hover:text-black  transition-colors"
                >
                  −
                </button>
                <input
                  value={quantity}
                  readOnly
                  className="w-12 text-center bg-transparent font-light text-gray-900 "
                />
                <button
                  onClick={handleIncrement}
                  className="w-10 h-10 flex items-center justify-center text-gray-500  hover:text-black  transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex-1 border border-black  py-4 px-8 uppercase text-sm tracking-widest hover:bg-black hover:text-white   transition-all duration-500 ease-out"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white py-4 px-8 uppercase text-sm tracking-widest border border-black  hover:bg-white hover:text-black     transition-all duration-500 ease-out"
              >
                Buy Now
              </button>
            </div>

            {showMessage && (
              <div className="flex items-center gap-2 text-sm text-green-800  bg-green-50  p-4 rounded-lg border border-green-100  animate-fade-in-up">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Added to cart successfully
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* REVIEWS */}
      <section className="border-t border-gray-200 py-16 lg:py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] gap-8 lg:gap-12">
            <ScrollReveal>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 space-y-5">
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase mb-2 font-medium text-gray-500">
                    Your Rating
                  </p>
                  <h2 className="text-2xl font-serif font-light text-gray-900">
                    Rate This Impression
                  </h2>
                  <p className="text-sm text-gray-500 font-light mt-2">
                    Add a star rating and optional review message.
                  </p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = index + 1;
                      const ActiveStar =
                        selectedRating >= value
                          ? StarSolidIcon
                          : StarOutlineIcon;

                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedRating(value)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform"
                          aria-label={`Rate ${value} stars`}
                        >
                          <ActiveStar className="h-7 w-7" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your impression (optional)..."
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="rounded-full px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors disabled:opacity-60"
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>

                {reviewMessage && (
                  <p className="text-sm text-gray-600 font-light">
                    {reviewMessage}
                  </p>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase font-medium text-gray-500 mb-2">
                      User Reviews
                    </p>
                    <h3 className="text-2xl font-serif font-light text-gray-900">
                      Customer Impressions
                    </h3>
                  </div>
                  <div className="text-right">
                    <Stars
                      rating={Math.round(averageRating)}
                      sizeClass="h-4 w-4"
                    />
                    <p className="text-sm text-gray-600 font-light mt-1">
                      {reviewCount > 0
                        ? `${averageRating.toFixed(1)} / 5 (${reviewCount})`
                        : "No reviews yet"}
                    </p>
                  </div>
                </div>

                {orderedReviews.length > 0 ? (
                  <div className="max-h-[460px] overflow-y-auto pr-1">
                    <ul className="space-y-3">
                      {orderedReviews.map((review) => (
                        <li
                          key={review.id}
                          className="rounded-xl border border-gray-200 p-4 bg-gray-50/60"
                        >
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <Stars rating={review.rating} sizeClass="h-4 w-4" />
                            <span className="text-xs text-gray-500 font-light">
                              {formatReviewDate(review.createdAt)}
                            </span>
                          </div>
                          {review.comment ? (
                            <p className="text-sm text-gray-700 font-light leading-relaxed">
                              {review.comment}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500 font-light italic">
                              No written comment.
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-light">
                    No reviews yet. Be the first to share your impression.
                  </p>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {relatedFragrances.length > 0 && (
        <section className="border-t border-gray-200 py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal>
              <div className="mb-8">
                <p className="text-xs tracking-[0.25em] uppercase text-gray-500 font-medium mb-3">
                  Related Impressions
                </p>
                <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900">
                  Other impressions you may like
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedFragrances.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 90}>
                  <Link
                    href={`/product/${item.id}`}
                    className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                      {isValidImageUrl(item.image) ? (
                        <Image
                          src={item.image!}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-3xl font-serif font-light text-gray-500">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-serif font-medium text-gray-900 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-light line-clamp-2 min-h-[2.5rem]">
                        {item.tagline || "Eau de parfum"}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        Rs {item.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
