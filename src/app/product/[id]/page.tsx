"use client";

import { fragrances as staticFragrances, type Fragrance } from "@/src/data/fragrances";
import ScrollReveal from "@/src/components/ScrollReveal";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface ProductPageProps {
  params: { id: string };
}

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

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const [fragrance, setFragrance] = useState<Fragrance | null>(null);
  const [loading, setLoading] = useState(true);

  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const staticOne = staticFragrances.find((f) => f.id === params.id);

    async function load() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(params.id)}`, { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && data.product) {
          setFragrance({
            id: data.product.id,
            name: data.product.name,
            tagline: data.product.tagline ?? "",
            price: data.product.price,
            image: data.product.image ?? "",
            topNotes: data.product.topNotes ?? [],
            heartNotes: data.product.heartNotes ?? [],
            baseNotes: data.product.baseNotes ?? [],
            fullDescription: data.product.fullDescription ?? "",
          });
        } else {
          setFragrance(staticOne ?? null);
        }
      } catch {
        if (cancelled) return;
        setFragrance(staticOne ?? null);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!fragrance) {
    notFound();
  }

  /* ✅ ADD TO CART */
  const handleAddToCart = () => {
    const cart = getCart();
    const existingItem = cart.find(
      (item) => item.id === fragrance.id
    );

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
    const existingItem = cart.find(
      (item) => item.id === fragrance.id
    );

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

  const isValidImageUrl = (image: string) =>
    image &&
    (image.startsWith("http") ||
      image.startsWith("/") ||
      image.startsWith("./"));

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 font-light">
          <Link href="/" className="hover:text-black">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/fragrances" className="hover:text-black">Collection</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{fragrance.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* IMAGE */}
        <ScrollReveal>
          <div className="sticky top-24">
            <div className="relative h-[600px] bg-gray-100 overflow-hidden border">
              {isValidImageUrl(fragrance.image) && !imageError ? (
                <img
                  src={fragrance.image}
                  alt={fragrance.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-7xl text-gray-300 font-serif">
                  {fragrance.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* DETAILS */}
        <ScrollReveal delay={100}>
          <div className="space-y-10">
            <div>
              <p className="text-xs tracking-widest text-gray-500 mb-3">
                EAU DE PARFUM
              </p>
              <h1 className="text-5xl font-serif font-light mb-4">
                {fragrance.name}
              </h1>
              <p className="text-lg text-gray-600 font-light italic">
                {fragrance.tagline}
              </p>
            </div>

            <div className="border-y py-6">
              <p className="text-3xl font-light">${fragrance.price}</p>
            </div>

            <div>
              <h2 className="text-sm tracking-widest uppercase mb-3">
                Description
              </h2>
              <p className="text-gray-700 font-light">
                {fragrance.fullDescription}
              </p>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
              <span className="text-sm">Quantity</span>
              <div className="flex border">
                <button onClick={handleDecrement} className="px-4">−</button>
                <input
                  value={quantity}
                  readOnly
                  className="w-12 text-center"
                />
                <button onClick={handleIncrement} className="px-4">+</button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 border-2 border-black py-4 uppercase text-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white py-4 uppercase text-sm"
              >
                Buy Now
              </button>
            </div>

            {showMessage && (
              <div className="text-sm text-green-700">
                ✓ Added to cart
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
