"use client";

import { fragrances } from "@/src/data/fragrances";
import ScrollReveal from "@/src/components/ScrollReveal";
import { notFound } from "next/navigation";
import { useState } from "react";

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const fragrance = fragrances.find((f) => f.id === params.id);
  const [showMessage, setShowMessage] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
    setTimeout(() => setShowMessage(false), 2000);
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <ScrollReveal>
            <div className="flex items-center justify-center">
              <div
                className="w-full h-96 rounded"
                style={{ backgroundColor: fragrance.image }}
              />
            </div>
          </ScrollReveal>

          {/* Product Details */}
          <ScrollReveal delay={100}>
            <div className="space-y-8">
              {/* Name & Tagline */}
              <div>
                <h1 className="text-4xl font-serif mb-2 font-light">
                  {fragrance.name}
                </h1>
                <p className="text-gray-600 font-light">{fragrance.tagline}</p>
              </div>

              {/* Price */}
              <div>
                <p className="text-2xl font-light">${fragrance.price}</p>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700 leading-relaxed font-light">
                  {fragrance.fullDescription}
                </p>
              </div>

              <div className="h-px bg-gray-200" />

              {/* Quantity & Action */}
              <div className="flex gap-4 items-center">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={handleDecrement}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
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
                    className="w-12 text-center border-l border-r border-gray-300 py-2 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={handleIncrement}
                    className="px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="border border-black bg-white hover:bg-black hover:text-white transition-colors px-6 py-2 text-sm font-light"
                >
                  Add to Cart
                </button>
              </div>

              {showMessage && (
                <div className="p-3 bg-gray-100 border border-gray-300 rounded text-gray-700 text-sm font-light">
                  ✓ {fragrance.name} added to cart
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-12" />

        {/* Fragrance Notes */}
        <ScrollReveal>
          <div>
            <h2 className="text-lg font-serif mb-6 font-light">Notes</h2>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <h3 className="text-xs font-light text-gray-600 mb-3 uppercase tracking-wider">
                  Top
                </h3>
                <ul className="space-y-2 text-sm font-light">
                  {fragrance.topNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-light text-gray-600 mb-3 uppercase tracking-wider">
                  Heart
                </h3>
                <ul className="space-y-2 text-sm font-light">
                  {fragrance.heartNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-light text-gray-600 mb-3 uppercase tracking-wider">
                  Base
                </h3>
                <ul className="space-y-2 text-sm font-light">
                  {fragrance.baseNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* White Space */}
        <div className="h-12" />
      </div>
    </div>
  );
}
