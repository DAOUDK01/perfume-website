"use client";

import Button from "@/src/components/Button";
import ScrollProgress from "@/src/components/ScrollProgress";
import ScrollReveal from "@/src/components/ScrollReveal";
import { fragrances } from "@/src/data/fragrances";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const sections = ["What is e'eora?", "Why us", "Collection", "Stay Updated"];

  return (
    <div className="bg-white">
      <ScrollProgress sections={sections} />

      {/* Hero Section - Elegant & Clean */}
      <section
        className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-white"
        data-scroll-section="0"
      >
        <ScrollReveal className="max-w-6xl mx-auto text-center w-full">
          {/* Minimalist title */}
          <div className="mb-16 sm:mb-20">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif font-semibold tracking-tight mb-6">
              e&apos;eora
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-light mb-4">
              A quiet expression of scent
            </p>
            <p className="text-sm sm:text-base text-gray-500 font-light max-w-xl mx-auto leading-relaxed">
              Thoughtfully crafted fragrances that speak softly
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 sm:gap-6 justify-center flex-wrap mb-20">
            <Link href="/fragrances">
              <Button variant="primary">Discover Collection</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="secondary">Shop Now</Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Scroll indicator at bottom */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs tracking-widest font-light">SCROLL</span>
          <div className="w-px h-12 bg-gray-300 animate-pulse" />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 sm:py-32 md:py-40 border-t border-gray-200 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white -z-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <div className="mb-6 sm:mb-8">
              <span className="text-5xl sm:text-6xl text-gray-300 font-serif"> " </span>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-light leading-relaxed mb-6 sm:mb-8">
              We believe fragrance should be intentional, not loud. Each scent is designed to complement, not overwhelm.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 sm:w-8 h-px bg-gray-300" />
              <span className="text-xs tracking-widest text-gray-400 font-light">PHILOSOPHY</span>
              <div className="w-6 sm:w-8 h-px bg-gray-300" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20 sm:py-32 md:py-40 border-t border-gray-200"
        data-scroll-section="1"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-4 sm:mb-6 font-light tracking-wide">Why e&apos;eora</h2>
            <p className="text-gray-500 font-light text-base sm:text-lg">Three pillars of our philosophy</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-200">
            {[
              {
                number: "01",
                title: "Carefully Selected",
                desc: "Premium ingredients sourced responsibly from trusted suppliers around the world. Each component is vetted for quality and sustainability.",
              },
              {
                number: "02",
                title: "Minimal Design",
                desc: "Clean, timeless bottles that reflect our philosophy of understated elegance. Form follows function in every detail.",
              },
              {
                number: "03",
                title: "Long Lasting",
                desc: "High concentration eau de parfum for all-day wear without reapplication. Crafted to evolve beautifully on your skin.",
              },
            ].map((feature, index) => (
              <ScrollReveal
                key={index}
                delay={index * 150}
                className="bg-white p-8 sm:p-10 md:p-12 hover:bg-gray-50 transition-colors duration-500 group"
              >
                <div className="text-xs text-gray-400 mb-4 sm:mb-6 font-light tracking-widest">
                  {feature.number}
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6 font-light group-hover:text-gray-600 transition-colors">
                  {feature.title}
                </h3>
                <div className="w-12 sm:w-16 h-px bg-gray-300 mb-4 sm:mb-6" />
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-light">
                  {feature.desc}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Carousel */}
      <section
        className="py-20 sm:py-32 md:py-40 border-t border-gray-200 bg-gradient-to-b from-white to-gray-50"
        data-scroll-section="2"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-16 sm:mb-24">
            <div className="inline-block">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-4 font-light tracking-wide">
                Featured Collection
              </h2>
              <div className="w-full h-px bg-gray-300" />
            </div>
            <p className="text-gray-600 font-light text-base sm:text-lg mt-6">
              Select from our curated fragrances
            </p>
          </ScrollReveal>

          <ProductCarousel fragrances={fragrances} />

          <ScrollReveal className="text-center mt-12 sm:mt-20">
            <Link href="/fragrances">
              <Button variant="secondary">Explore Full Collection</Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 sm:py-32 md:py-40 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 items-center">
            <ScrollReveal>
              <div className="relative">
                <div className="border border-gray-200 p-12 sm:p-16 rounded flex items-center justify-center h-[400px] sm:h-[500px] bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                  <div className="absolute top-10 right-10 w-32 sm:w-40 h-32 sm:h-40 bg-gray-200 rounded-full blur-3xl opacity-30" />
                  <div className="text-center relative z-10">
                    <div className="text-7xl sm:text-8xl md:text-9xl font-serif font-light text-gray-300 mb-4 sm:mb-6">
                      100
                    </div>
                    <div className="w-20 sm:w-24 h-px bg-gray-300 mx-auto mb-4" />
                    <p className="text-xs sm:text-sm text-gray-500 font-light tracking-widest">
                      PERCENT NATURAL
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="space-y-6 sm:space-y-8">
                <div>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-4 sm:mb-6 leading-tight">
                    Crafted with intention
                  </h3>
                  <div className="w-16 sm:w-20 h-px bg-gray-300 mb-6 sm:mb-8" />
                </div>
                
                <p className="text-base sm:text-lg text-gray-700 font-light leading-relaxed">
                  Every bottle is a result of careful consideration. We work with master perfumers to create scents that are both timeless and contemporary.
                </p>
                
                <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                  Our commitment to quality means using only the finest natural and synthetic ingredients, blended in precise concentrations for optimal performance and longevity.
                </p>

                <div className="pt-4 sm:pt-6">
                  <Link href="/fragrances" className="inline-flex items-center gap-2 text-sm font-light border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                    Learn about our process
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-20 sm:py-32 md:py-40 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200"
        data-scroll-section="3"
      >
        <ScrollReveal className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 sm:mb-6 font-light tracking-wide">
            Stay Updated
          </h2>
          <div className="w-20 sm:w-24 h-px bg-gray-300 mx-auto mb-6 sm:mb-8" />
          <p className="text-base sm:text-lg text-gray-600 mb-4 font-light">
            Get notified about new releases and special offers
          </p>
          <p className="text-xs text-gray-500 mb-8 sm:mb-12 font-light">
            We&apos;ll only use your email for order updates and new collection announcements.
          </p>
          
          <div className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 sm:px-8 py-4 sm:py-5 border border-gray-300 text-sm focus:outline-none focus:border-black transition-colors font-light rounded"
              />
              <Button variant="primary">Subscribe</Button>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-12 sm:mt-16 flex items-center justify-center gap-4 text-xs text-gray-400 font-light tracking-widest">
            <span className="text-center">TRUSTED BY 10,000+ CUSTOMERS</span>
          </div>
        </ScrollReveal>

        <div className="h-20 sm:h-32" />
      </section>
    </div>
  );
}

// Product Carousel Component with Images
function ProductCarousel({ fragrances }: { fragrances: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % fragrances.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + fragrances.length) % fragrances.length);
  };

  // Calculate visible items based on screen size
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 4;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }
    return 4;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  // Update visible count on resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      setVisibleCount(getVisibleCount());
    });
  }

  const visibleFragrances = [];
  for (let i = 0; i < visibleCount; i++) {
    const index = (currentIndex + i) % fragrances.length;
    visibleFragrances.push(fragrances[index]);
  }

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  // Check if image is a valid URL or color code
  const isValidImageUrl = (image: string) => {
    return image && (image.startsWith('http') || image.startsWith('/') || image.startsWith('./'));
  };

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {visibleFragrances.map((fragrance) => (
            <div key={fragrance.id} className="animate-in fade-in duration-500">
              <Link
                href={`/product/${fragrance.id}`}
                className="group block"
              >
                <div className="space-y-6">
                  {/* Product Card with Image */}
                  <div className="bg-white border border-gray-200 rounded overflow-hidden group-hover:border-gray-400 group-hover:shadow-2xl transition-all duration-500 relative h-80 sm:h-96">
                    {isValidImageUrl(fragrance.image) && !imageErrors[fragrance.id] ? (
                      <>
                        <img
                          src={fragrance.image}
                          alt={fragrance.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={() => handleImageError(fragrance.id)}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
                          <span className="text-white text-sm font-light tracking-widest">VIEW DETAILS</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors duration-500">
                        <div className="text-6xl sm:text-7xl font-serif font-light text-gray-300 mb-4 group-hover:text-gray-400 transition-colors">
                          {fragrance.name.charAt(0)}
                        </div>
                        <div className="w-16 h-px bg-gray-300 mb-4" />
                        <h3 className="text-xl font-serif font-light text-gray-600 mb-2">
                          {fragrance.name}
                        </h3>
                        <p className="text-xs tracking-widest text-gray-400 font-light">
                          EAU DE PARFUM
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-4 px-2">
                    <h3 className="text-xl sm:text-2xl font-serif font-light group-hover:text-gray-700 transition-colors">
                      {fragrance.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed min-h-12">
                      {fragrance.tagline}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl font-light">${fragrance.price}</span>
                      <span className="text-xs text-gray-400 font-light tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        VIEW →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-8 sm:mt-12">
        <button
          onClick={prevSlide}
          className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-all duration-300"
          aria-label="Previous"
        >
          <span className="text-gray-600">←</span>
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition-all duration-300"
          aria-label="Next"
        >
          <span className="text-gray-600">→</span>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {fragrances.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-gray-600 w-8' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}