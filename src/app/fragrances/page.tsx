"use client";

import Button from "@/src/components/Button";
import { fragrances } from "@/src/data/fragrances";
import { useState } from "react";
import Link from "next/link";

export default function FragrancesPage() {
  return (
    <div className="bg-white pt-24">
      {/* Page Header */}
      <section className="border-b border-gray-200 py-12 mb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-serif mb-2 font-light">
            All Fragrances
          </h1>
          <p className="text-gray-600">
            Our complete collection of fragrances.
          </p>
        </div>
      </section>

      {/* Fragrances Grid */}
      <section>
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fragrances.map((fragrance) => (
              <FragranceCard key={fragrance.id} fragrance={fragrance} />
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
    <Link href={`/product/${fragrance.id}`}>
      <div className="group cursor-pointer relative block">
        {/* Color Block */}
        <div 
          className="w-full h-80 mb-4 rounded overflow-hidden group-hover:scale-105 transition-transform duration-300 transform group-hover:shadow-lg"
          style={{ backgroundColor: fragrance.image }}
        ></div>
        <h3 className="text-lg font-serif font-light mb-1">{fragrance.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{fragrance.tagline}</p>
        <div className="flex justify-between items-center">
          <span>${fragrance.price}</span>
          <button 
            onClick={handleAddToCart}
            className="text-sm border-b border-black hover:text-gray-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>

        {showMessage && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-80 rounded text-white text-sm font-light animate-fadeIn">
            Added to cart!
          </div>
        )}
      </div>
    </Link>
  );
}
