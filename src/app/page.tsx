"use client";

import Button from "@/src/components/Button";
import { fragrances } from "@/src/data/fragrances";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-serif mb-6">e&apos;eora</h1>
          <p className="text-lg text-gray-600 mb-12">
            A quiet expression of scent.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Button variant="primary">Explore</Button>
            <Button variant="secondary">Buy Now</Button>
          </div>
        </div>
      </section>

      {/* Hero Color Block */}
      <section className="mb-16">
        <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-100"></div>
      </section>

      {/* Buying Section */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-serif mb-16 font-light text-center">
            Featured Collection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {fragrances.map((fragrance) => (
              <div key={fragrance.id} className="group cursor-pointer">
                {/* Product Color Block */}
                <div 
                  className="w-full h-80 mb-6 overflow-hidden rounded group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundColor: fragrance.image }}
                ></div>

                {/* Product Info */}
                <h3 className="text-lg font-serif mb-2 font-light">
                  {fragrance.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {fragrance.tagline}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">${fragrance.price}</span>
                  <Link href="/checkout">
                    <button className="text-sm border-b border-black hover:text-gray-600 transition-colors">
                      Add to Cart
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif mb-8 font-light">
            Our Craft
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Every fragrance is thoughtfully created with intention and care. We believe in simplicity, quality, and the power of a well-made scent to speak for itself.
          </p>
          <p className="text-gray-700 mb-8 leading-relaxed">
            e&apos;eora represents a philosophy of quiet elegance—where every detail matters, and nothing is rushed.
          </p>
          <Button variant="secondary">Learn More</Button>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif mb-6 font-light">
            Stay Updated
          </h2>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 border border-gray-300 text-sm"
            />
            <Button variant="primary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
