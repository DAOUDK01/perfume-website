"use client";

import Button from "@/src/components/Button";
import ScrollProgress from "@/src/components/ScrollProgress";
import ScrollReveal from "@/src/components/ScrollReveal";
import { fragrances as staticFragrances } from "@/src/data/fragrances";
import Link from "next/link";
import { useEffect, useState } from "react";

type FragranceItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image?: string;
};

export default function HomePage() {
  const sections = ["What is e'eora?", "Why us", "Collection", "Stay Updated"];
  const [featuredList, setFeaturedList] = useState<FragranceItem[]>(staticFragrances);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        const staticIds = new Set(staticFragrances.map((f) => f.id));
        if (res.ok && Array.isArray(data.products)) {
          const fromApi = (data.products as FragranceItem[]).filter((p) => !staticIds.has(p.id));
          setFeaturedList([...staticFragrances, ...fromApi]);
        }
      } catch {
        // keep static list on error
      } finally {
        if (cancelled) return;
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-[#fafafa]">
      <ScrollProgress sections={sections} />

      {/* Hero — e'eora in Agrandir Bold, no space */}
      <section
        className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-white"
        data-scroll-section="0"
      >
        <ScrollReveal className="max-w-4xl mx-auto text-center w-full">
          <h1
            className="font-agrandir font-bold tracking-tighter text-[clamp(3.5rem,12vw,8.5rem)] leading-[0.95] text-gray-900 mb-8"
            style={{ letterSpacing: "-0.04em" }}
          >
            e&apos;eora
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-500 font-light tracking-wide mb-3">
            A quiet expression of scent
          </p>
          <p className="text-sm text-gray-400 font-light max-w-md mx-auto mb-14">
            Thoughtfully crafted fragrances that speak softly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/fragrances">
              <Button variant="primary">Discover Collection</Button>
            </Link>
            <Link href="/checkout">
              <Button variant="secondary">Shop Now</Button>
            </Link>
          </div>
        </ScrollReveal>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300">
          <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gray-200" />
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 sm:py-32 md:py-40 bg-[#fafafa] border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <ScrollReveal>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 font-light leading-relaxed">
              We believe fragrance should be intentional, not loud. Each scent is designed to complement, not overwhelm.
            </p>
            <span className="inline-block mt-8 text-[10px] tracking-[0.35em] text-gray-400 uppercase">Philosophy</span>
          </ScrollReveal>
        </div>
      </section>

      {/* Why e'eora — three pillars */}
      <section
        className="py-24 sm:py-32 md:py-40 bg-white"
        data-scroll-section="1"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-14 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 mb-3">Why e&apos;eora</h2>
            <p className="text-gray-500 font-light">Three pillars of our philosophy</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { number: "01", title: "Carefully Selected", desc: "Premium ingredients sourced responsibly from trusted suppliers. Each component is vetted for quality and sustainability." },
              { number: "02", title: "Minimal Design", desc: "Clean, timeless bottles that reflect understated elegance. Form follows function in every detail." },
              { number: "03", title: "Long Lasting", desc: "High concentration eau de parfum for all-day wear. Crafted to evolve beautifully on your skin." },
            ].map((item, i) => (
              <ScrollReveal
                key={item.number}
                delay={i * 100}
                className="bg-[#fafafa] rounded-2xl p-8 md:p-10 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300"
              >
                <span className="text-[10px] text-gray-400 tracking-[0.3em]">{item.number}</span>
                <h3 className="text-xl md:text-2xl font-serif font-light mt-4 mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 font-light text-sm md:text-base leading-relaxed">{item.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section
        className="py-24 sm:py-32 md:py-40 bg-[#fafafa] border-t border-gray-100"
        data-scroll-section="2"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-14 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 mb-3">Featured Collection</h2>
            <p className="text-gray-500 font-light">Select from our curated fragrances</p>
          </ScrollReveal>
          <ProductCarousel fragrances={featuredList} />
          <ScrollReveal className="text-center mt-12 md:mt-16">
            <Link href="/fragrances">
              <Button variant="secondary">Explore Full Collection</Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="py-24 sm:py-32 md:py-40 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-12 sm:p-16 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px]">
                <span className="text-7xl sm:text-8xl md:text-9xl font-serif font-light text-gray-200">100</span>
                <span className="mt-4 text-[10px] tracking-[0.35em] text-gray-400 uppercase">Percent natural</span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-gray-900 mb-6">Crafted with intention</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-6">
                  Every bottle is a result of careful consideration. We work with master perfumers to create scents that are both timeless and contemporary.
                </p>
                <p className="text-gray-500 font-light text-sm leading-relaxed mb-8">
                  Our commitment to quality means using only the finest ingredients, blended in precise concentrations for optimal performance and longevity.
                </p>
                <Link href="/fragrances" className="inline-flex items-center gap-2 text-sm font-light border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                  Learn about our process <span>→</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stay Updated */}
      <section
        className="py-24 sm:py-32 md:py-40 bg-[#fafafa] border-t border-gray-100"
        data-scroll-section="3"
      >
        <ScrollReveal className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 font-light mb-2">New releases and offers</p>
          <p className="text-xs text-gray-400 mb-8">Order updates and collection announcements only.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-5 py-4 border border-gray-200 rounded-xl text-sm font-light focus:outline-none focus:border-gray-900 bg-white"
            />
            <Button variant="primary">Subscribe</Button>
          </div>
          <p className="mt-10 text-[10px] text-gray-400 tracking-widest">Trusted by 10,000+ customers</p>
        </ScrollReveal>
        <div className="h-16 sm:h-24" />
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
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden group-hover:border-gray-200 group-hover:shadow-xl transition-all duration-300 relative h-80 sm:h-96">
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