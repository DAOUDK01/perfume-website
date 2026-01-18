"use client";

import { fragrances } from "@/src/data/fragrances";
import ScrollReveal from "@/src/components/ScrollReveal";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();
  const fragrance = fragrances.find((f) => f.id === params.id);
  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!fragrance) {
    notFound();
  }

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === fragrance.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...fragrance, quantity: quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  const handleBuyNow = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === fragrance.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...fragrance, quantity: quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/checkout");
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const isValidImageUrl = (image: string) => {
    return image && (image.startsWith('http') || image.startsWith('/') || image.startsWith('./'));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-light">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/fragrances" className="hover:text-gray-900 transition-colors">Collection</Link>
            <span>/</span>
            <span className="text-gray-900">{fragrance.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Product Image */}
          <ScrollReveal>
            <div className="sticky top-24">
              <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {isValidImageUrl(fragrance.image) && !imageError ? (
                  <img
                    src={fragrance.image}
                    alt={fragrance.name}
                    className="w-full h-[500px] sm:h-[600px] object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-[500px] sm:h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
                    <div className="text-8xl sm:text-9xl font-serif font-light text-gray-300 mb-6">
                      {fragrance.name.charAt(0)}
                    </div>
                    <div className="w-24 h-px bg-gray-300 mb-4" />
                    <p className="text-sm tracking-widest text-gray-400 font-light">
                      {fragrance.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Product Details */}
          <ScrollReveal delay={100}>
            <div className="space-y-8 sm:space-y-10">
              {/* Name & Category */}
              <div>
                <p className="text-xs tracking-widest text-gray-500 font-light mb-3">
                  EAU DE PARFUM
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-4 font-light leading-tight">
                  {fragrance.name}
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 font-light italic">
                  {fragrance.tagline}
                </p>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-6">
                <p className="text-3xl sm:text-4xl font-light">${fragrance.price}</p>
                <p className="text-sm text-gray-500 font-light mt-2">
                  50ml / 1.7 fl oz
                </p>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-sm tracking-widest text-gray-900 font-light mb-4 uppercase">
                  Description
                </h2>
                <p className="text-base text-gray-700 leading-relaxed font-light">
                  {fragrance.fullDescription}
                </p>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm text-gray-600 font-light">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={handleDecrement}
                      className="px-5 py-3 hover:bg-gray-50 transition-colors text-gray-600"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val > 0) setQuantity(val);
                      }}
                      className="w-16 text-center border-l border-r border-gray-300 py-3 focus:outline-none font-light"
                      min="1"
                    />
                    <button
                      onClick={handleIncrement}
                      className="px-5 py-3 hover:bg-gray-50 transition-colors text-gray-600"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 border-2 border-black bg-white hover:bg-gray-50 text-black transition-all duration-300 px-8 py-4 text-sm font-light tracking-wide uppercase"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-black hover:bg-gray-800 text-white transition-all duration-300 px-8 py-4 text-sm font-light tracking-wide uppercase"
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {showMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800 text-sm font-light flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
                  <span className="text-lg">✓</span>
                  <span>{fragrance.name} has been added to your cart</span>
                </div>
              )}

              {/* Features */}
              <div className="border-t border-gray-200 pt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-gray-400">✓</span>
                  <div>
                    <p className="text-sm font-light text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-500 font-light">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-400">✓</span>
                  <div>
                    <p className="text-sm font-light text-gray-900">100% Authentic</p>
                    <p className="text-xs text-gray-500 font-light">Guaranteed genuine products</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-gray-400">✓</span>
                  <div>
                    <p className="text-sm font-light text-gray-900">30-Day Returns</p>
                    <p className="text-xs text-gray-500 font-light">Easy returns and exchanges</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Fragrance Notes */}
        <div className="mt-20 sm:mt-32">
          <ScrollReveal>
            <div className="border-t border-gray-200 pt-12 sm:pt-16">
              <h2 className="text-3xl sm:text-4xl font-serif mb-10 sm:mb-12 font-light text-center">
                Fragrance Notes
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-4xl mx-auto">
                <div className="text-center sm:text-left">
                  <div className="inline-block border border-gray-300 rounded-full px-6 py-2 mb-4">
                    <h3 className="text-xs font-light text-gray-600 uppercase tracking-wider">
                      Top Notes
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {fragrance.topNotes.map((note) => (
                      <li key={note} className="text-base font-light text-gray-700">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center sm:text-left">
                  <div className="inline-block border border-gray-300 rounded-full px-6 py-2 mb-4">
                    <h3 className="text-xs font-light text-gray-600 uppercase tracking-wider">
                      Heart Notes
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {fragrance.heartNotes.map((note) => (
                      <li key={note} className="text-base font-light text-gray-700">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center sm:text-left">
                  <div className="inline-block border border-gray-300 rounded-full px-6 py-2 mb-4">
                    <h3 className="text-xs font-light text-gray-600 uppercase tracking-wider">
                      Base Notes
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {fragrance.baseNotes.map((note) => (
                      <li key={note} className="text-base font-light text-gray-700">
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Back to Collection */}
        <div className="mt-16 sm:mt-20 text-center">
          <Link
            href="/fragrances"
            className="inline-flex items-center gap-2 text-sm font-light border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            <span>←</span>
            Back to Collection
          </Link>
        </div>
      </div>
    </div>
  );
}