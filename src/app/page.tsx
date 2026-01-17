"use client";

import Button from "@/src/components/Button";
import ScrollProgress from "@/src/components/ScrollProgress";
import ScrollReveal from "@/src/components/ScrollReveal";
import { fragrances } from "@/src/data/fragrances";
import Link from "next/link";

export default function HomePage() {
  const sections = ["What is e'eora?", "Why us", "Collection", "Stay Updated"];

  return (
    <div className="bg-white">
      <ScrollProgress sections={sections} />

      {/* Hero Section - Clear intent: What is e'eora? */}
      <section
        className="min-h-[90vh] flex items-center justify-center pt-20 pb-20 relative overflow-hidden"
        data-scroll-section="0"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10" />

        <ScrollReveal className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-serif mb-6 font-light">
            e&apos;eora
          </h1>

          <div className="w-24 h-1 bg-black mx-auto mb-8" />

          <p className="text-xl text-gray-600 mb-4 font-light">
            A quiet expression of scent
          </p>

          <p className="text-lg text-gray-500 mb-12 font-light leading-relaxed">
            Thoughtfully crafted fragrances that speak softly. Premium
            ingredients. Minimal design. All-day lasting wear.
          </p>

          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/fragrances">
              <Button variant="primary">Discover Collection</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="secondary">Shop Now</Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Features Section - Why us */}
      <section
        className="py-24 border-t border-gray-200 bg-white"
        data-scroll-section="1"
      >
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4 font-light">Why e&apos;eora</h2>
            <p className="text-gray-600 font-light">
              We believe fragrance should be intentional, not loud
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Carefully Selected",
                desc: "Premium ingredients sourced responsibly",
              },
              {
                title: "Minimal Design",
                desc: "Clean, timeless bottles that reflect our philosophy",
              },
              {
                title: "Long Lasting",
                desc: "High concentration for all-day wear",
              },
            ].map((feature, index) => (
              <ScrollReveal
                key={index}
                delay={index * 100}
                className="text-center"
              >
                <h3 className="text-lg font-serif mb-3 font-light">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  {feature.desc}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Clear intent: What can I buy? */}
      <section
        className="py-24 border-t border-gray-200"
        data-scroll-section="2"
      >
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4 font-light">
              Featured Collection
            </h2>
            <p className="text-gray-600 font-light">
              Select from our curated fragrances
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fragrances.map((fragrance, index) => (
              <ScrollReveal key={fragrance.id} delay={index * 50}>
                <Link
                  href={`/product/${fragrance.id}`}
                  className="group block"
                >
                  {/* Product grouping: Image, Info, Price, Action */}
                  <div className="space-y-6">
                    {/* Color Block with Hover */}
                    <div
                      className="w-full h-80 rounded overflow-hidden cursor-pointer transition-all duration-300 transform group-hover:shadow-lg group-hover:-translate-y-2"
                      style={{ backgroundColor: fragrance.image }}
                    />

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-serif font-light cursor-pointer group-hover:text-gray-600 transition-colors">
                        {fragrance.name}
                      </h3>
                      <p className="text-sm text-gray-600 cursor-pointer font-light">
                        {fragrance.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center">
                      <span className="text-lg font-light cursor-pointer">
                        ${fragrance.price}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-gray-200 bg-gray-50">
        <ScrollReveal className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-6 font-light">
            Ready to explore?
          </h2>
          <p className="text-gray-600 mb-12 text-lg font-light leading-relaxed">
            Discover the complete collection and find your signature scent
          </p>
          <Link href="/fragrances">
            <Button variant="primary">View All Fragrances</Button>
          </Link>
        </ScrollReveal>
      </section>

      {/* Newsletter Section - Stay Updated */}
      <section
        className="py-24 bg-white border-t border-gray-200"
        data-scroll-section="3"
      >
        <ScrollReveal className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif mb-4 font-light">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8 font-light">
            Get notified about new releases and special offers
          </p>
          <p className="text-xs text-gray-500 mb-6 font-light">
            We&apos;ll only use your email for order updates and new collection
            announcements.
          </p>
          <div className="flex gap-2">
           <input
  type="email"
  placeholder="Your email"
  className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors"
/>

            <Button variant="primary">Subscribe</Button>
          </div>
        </ScrollReveal>

        {/* White space */}
        <div className="h-12" />
      </section>
    </div>
  );
}
