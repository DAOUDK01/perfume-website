"use client";

import type { Fragrance } from "@/src/data/fragrances";
import ScrollReveal from "@/src/components/ScrollReveal";
import ProductImageCarousel from "@/src/components/ProductImageCarousel";
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


  useEffect(() => {
    let cancelled = false;

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
            images: Array.isArray(data.product.images) && data.product.images.length > 0
              ? data.product.images
              : [data.product.image ?? ""].filter(Boolean),
            topNotes: data.product.topNotes ?? [],
            heartNotes: data.product.heartNotes ?? [],
            baseNotes: data.product.baseNotes ?? [],
            fullDescription: data.product.fullDescription ?? "",
          });
        } else {
          // If API returns no product or error, set fragrance to null
          setFragrance(null);
        }
      } catch {
        if (cancelled) return;
        setFragrance(null);
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
            <ProductImageCarousel
              images={fragrance.images || (fragrance.image ? [fragrance.image] : [])}
              name={fragrance.name}
            />
          </div>
        </ScrollReveal>

        {/* DETAILS */}
        <ScrollReveal delay={100}>
          <div className="space-y-10 animate-fade-in-up">
            <div>
              <p className="text-xs tracking-[0.2em] text-gray-500 mb-4 uppercase">
                EAU DE PARFUM
              </p>
              <h1 className="text-5xl md:text-6xl font-serif font-light mb-4 tracking-tight">
                {fragrance.name}
              </h1>
              <p className="text-xl text-gray-600 font-light italic">
                {fragrance.tagline}
              </p>
            </div>

            <div className="border-y border-gray-100 py-8">
              <p className="text-3xl font-light tracking-wide">Rs {fragrance.price}</p>
            </div>

            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase mb-4 font-medium text-gray-900">
                Description
              </h2>
              <p className="text-gray-600 font-light leading-relaxed text-lg">
                {fragrance.fullDescription}
              </p>
            </div>

            {/* QUANTITY */}
            <div className="flex items-center gap-6">
              <span className="text-sm uppercase tracking-widest text-gray-500">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-full px-2 py-1 hover:border-black transition-colors duration-300">
                <button 
                  onClick={handleDecrement} 
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  −
                </button>
                <input
                  value={quantity}
                  readOnly
                  className="w-12 text-center bg-transparent font-light"
                />
                <button 
                  onClick={handleIncrement} 
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={handleAddToCart}
                className="flex-1 border border-black py-4 px-8 uppercase text-sm tracking-widest hover:bg-black hover:text-white transition-all duration-500 ease-out"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white py-4 px-8 uppercase text-sm tracking-widest border border-black hover:bg-white hover:text-black transition-all duration-500 ease-out"
              >
                Buy Now
              </button>
            </div>

            {showMessage && (
              <div className="flex items-center gap-2 text-sm text-green-800 bg-green-50 p-4 rounded-lg border border-green-100 animate-fade-in-up">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Added to cart successfully
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
