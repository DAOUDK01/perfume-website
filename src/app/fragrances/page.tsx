"use client";

import { fragrances } from "@/src/data/fragrances";
import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/src/components/ScrollReveal";

export default function FragrancesPage() {
  return (
    <div className="bg-white pt-24">
      {/* Page Header - Answer: What can I buy? */}
      <section className="border-b border-gray-200 py-12 mb-16">
        <ScrollReveal className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-serif mb-2 font-light">
            Shop Collection
          </h1>
          <p className="text-gray-600 font-light">
            Browse our complete range of fragrances.
          </p>
        </ScrollReveal>
      </section>

      {/* Fragrances Grid */}
      <section>
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fragrances.map((fragrance, index) => (
              <ScrollReveal key={fragrance.id} delay={index * 50}>
                <FragranceCard fragrance={fragrance} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FragranceCard({ fragrance }: any) {
  const [showMessage, setShowMessage] = useState(false);

  const handleAddToCart = (e: any) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === fragrance.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...fragrance, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <div className="group relative">
      <Link href={`/product/${fragrance.id}`} className="block">
        {/* Color Block */}
        <div
          className="w-full h-80 mb-4 rounded overflow-hidden group-hover:scale-105 transition-transform duration-300 transform group-hover:shadow-lg cursor-pointer"
          style={{ backgroundColor: fragrance.image }}
        ></div>
        <div className="space-y-2">
          <h3 className="text-lg font-serif font-light cursor-pointer group-hover:text-gray-600 transition-colors">
            {fragrance.name}
          </h3>
          <p className="text-sm text-gray-600 cursor-pointer font-light">
            {fragrance.tagline}
          </p>
          <div className="text-lg font-light cursor-pointer">
            ${fragrance.price}
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        className="mt-4 text-sm border-b border-black hover:text-gray-600 transition-colors font-light"
      >
        Add to Cart
      </button>

      {showMessage && (
        <div className="absolute top-20 right-0 bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-700 text-sm font-light animate-fadeIn whitespace-nowrap">
          ✓ Added to cart
        </div>
      )}
    </div>
  );
}
