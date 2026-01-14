"use client";

import Button from "@/src/components/Button";
import { fragrances } from "@/src/data/fragrances";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">

      {/* Hero Section - Redesigned */}
      <section className="min-h-[90vh] flex items-center justify-center pt-20 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10" />
        
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-serif mb-6 font-light animate-fadeInUp">
            e&apos;eora
          </h1>
          
          <div className="w-24 h-1 bg-black mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: "0.1s" }} />
          
          <p className="text-xl text-gray-600 mb-4 font-light animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
            A quiet expression of scent
          </p>
          
          <p className="text-lg text-gray-500 mb-12 font-light animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            Thoughtfully crafted fragrances that speak softly
          </p>

          <div className="flex gap-6 justify-center flex-wrap animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
            <Link href="/fragrances">
              <Button variant="primary">Discover Collection</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="secondary">Shop Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Carefully Selected", desc: "Premium ingredients sourced from around the world" },
              { title: "Minimal Design", desc: "Clean, timeless bottles that reflect our philosophy" },
              { title: "Lasting Fragrance", desc: "High concentration formulas for all-day wear" },
            ].map((feature, index) => (
              <div key={index} className="text-center animate-fadeInUp" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                <h3 className="text-lg font-serif mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-5xl font-serif mb-4 font-light">Featured Collection</h2>
            <p className="text-gray-600">Select from our curated fragrances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fragrances.map((fragrance, index) => (
              <Link 
                key={fragrance.id}
                href={`/product/${fragrance.id}`}
                className="group animate-fadeInUp block" 
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                {/* Color Block with Hover */}
                <div 
                  className="w-full h-80 mb-6 rounded overflow-hidden cursor-pointer transition-all duration-300 transform group-hover:shadow-lg group-hover:-translate-y-2"
                  style={{ backgroundColor: fragrance.image }}
                ></div>

                {/* Product Info */}
                <h3 className="text-lg font-serif mb-2 font-light cursor-pointer group-hover:text-opacity-70 transition-opacity">
                  {fragrance.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 cursor-pointer">
                  {fragrance.tagline}
                </p>

                {/* Price */}
                <div className="flex items-center">
                  <span className="text-lg font-semibold cursor-pointer">${fragrance.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-200 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center animate-fadeInUp">
          <h2 className="text-4xl font-serif mb-6 font-light">
            Explore More
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Discover the complete collection and find your signature scent
          </p>
          <Link href="/fragrances">
            <Button variant="primary">View All Fragrances</Button>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto px-6 text-center animate-fadeInUp">
          <h2 className="text-2xl font-serif mb-6 font-light">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-6">Get notified about new releases and special offers</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors"
            />
            <Button variant="primary">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
