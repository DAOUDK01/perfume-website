"use client";

import { fragrances } from "@/src/data/fragrances";
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
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white pt-24">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Product Color Block */}
          <div className="flex items-center justify-center">
            <div 
              className="w-full h-96 rounded"
              style={{ backgroundColor: fragrance.image }}
            ></div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-serif mb-2">{fragrance.name}</h1>
            <p className="text-gray-600 mb-8">{fragrance.tagline}</p>

            <p className="text-2xl font-semibold mb-8">${fragrance.price}</p>

            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                {fragrance.fullDescription}
              </p>
            </div>

            <div className="h-px bg-gray-200 my-8" />

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
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm font-light">
                ✓ {fragrance.name} added to cart!
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-12" />

        {/* Fragrance Notes */}
        <div className="mb-12">
          <h2 className="text-lg font-serif mb-6">Notes</h2>
          
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-normal text-gray-600 mb-3 uppercase">
                Top Notes
              </h3>
              <ul className="space-y-2 text-sm">
                {fragrance.topNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-normal text-gray-600 mb-3 uppercase">
                Heart Notes
              </h3>
              <ul className="space-y-2 text-sm">
                {fragrance.heartNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-normal text-gray-600 mb-3 uppercase">
                Base Notes
              </h3>
              <ul className="space-y-2 text-sm">
                {fragrance.baseNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-12" />

        {/* Price and Purchase */}
        <div className="mb-12">
          <p className="text-2xl font-normal mb-8">${fragrance.price}</p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex border border-gray-200">
              <button className="px-4 py-2 hover:bg-gray-50 transition-colors">
                −
              </button>
              <input
                type="number"
                defaultValue="1"
                className="w-12 text-center border-l border-r border-gray-200 py-2 focus:outline-none"
                min="1"
              />
              <button className="px-4 py-2 hover:bg-gray-50 transition-colors">
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
        </div>
      </div>
    </div>
  );
}
