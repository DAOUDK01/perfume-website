"use client";

import Button from "@/src/components/Button";
import ScrollProgress from "@/src/components/ScrollProgress";
import ScrollReveal from "@/src/components/ScrollReveal";
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
  const [featuredList, setFeaturedList] = useState<FragranceItem[]>([]);

  // For "Stay Updated" section
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Failed to subscribe.");
      }

      setMessage(data.message || "Subscribed successfully!");
      setEmail(""); // Clear email on success
    } catch (error: any) {
      console.error("Subscription error:", error);
      setMessage(error.message || "Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && Array.isArray(data.products)) {
          setFeaturedList(data.products as FragranceItem[]);
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-60 pointer-events-none" />
        
        <ScrollReveal className="max-w-4xl mx-auto text-center w-full relative z-10">
          <h1
            className="font-agrandir font-bold tracking-tighter text-[clamp(4rem,15vw,10rem)] leading-[0.9] text-gray-900 mb-6 animate-fade-in-up"
            style={{ letterSpacing: "-0.05em" }}
          >
            e&apos;eora
          </h1>
          <div className="space-y-4 animate-fade-in-up delay-100">
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 font-light tracking-wide">
              A quiet expression of scent
            </p>
            <p className="text-sm md:text-base text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
              Thoughtfully crafted fragrances that speak softly, designed to linger in memory rather than dominate the room.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 animate-fade-in-up delay-200">
            <Link href="/fragrances">
              <Button variant="primary" className="px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow">Discover Collection</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="px-10 py-4 text-lg">Our Philosophy</Button>
            </Link>
          </div>
        </ScrollReveal>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-px h-16 bg-gradient-to-b from-gray-300 to-transparent" />
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 mb-3">Why <span className="font-agrandir">e'eora</span></h2>
            <p className="text-gray-500 font-light text-lg">Three pillars of our philosophy</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              { number: "01", title: "Carefully Selected", desc: "Premium ingredients sourced responsibly from trusted suppliers. Each component is vetted for quality and sustainability." },
              { number: "02", title: "Minimal Design", desc: "Clean, timeless bottles that reflect understated elegance. Form follows function in every detail." },
              { number: "03", title: "Long Lasting", desc: "High concentration eau de parfum for all-day wear. Crafted to evolve beautifully on your skin." },
            ].map((item, i) => (
              <ScrollReveal
                key={item.number}
                delay={i * 150}
                className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
              >
                <span className="text-xs font-medium text-gray-400 tracking-[0.3em] group-hover:text-black transition-colors">{item.number}</span>
                <h3 className="text-2xl md:text-3xl font-serif font-light mt-6 mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 font-light text-base leading-relaxed">{item.desc}</p>
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
              <div className="rounded-2xl border  p-12 sm:p-16 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px]">
                <img src="https://tse3.mm.bing.net/th/id/OIP.em5gobhJqjf9K0-pJqGbuwHaFj?w=1280&h=959&rs=1&pid=ImgDetMain&o=7&rm=33" alt="" />
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
                <Link href="/about" className="inline-flex items-center gap-2 text-sm font-light border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-gray-900 mb-6">Stay Updated</h2>
          <p className="text-gray-600 font-light text-lg mb-2">New releases and exclusive offers</p>
          <p className="text-sm text-gray-400 mb-10 font-light">Order updates and collection announcements only.</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 relative">
            <div className="relative flex-1 group">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 border border-gray-200 rounded-full text-base font-light focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white transition-all duration-300 placeholder:text-gray-300 shadow-sm group-hover:shadow-md"
                required
              />
            </div>
            <Button variant="primary" type="submit" disabled={isSubmitting} className="rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          
          {message && (
            <div className={`mt-6 p-4 rounded-xl border ${message.includes("successfully") ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"} text-sm font-light animate-fade-in`}>
              {message}
            </div>
          )}
          <p className="mt-12 text-[10px] text-gray-400 tracking-widest uppercase opacity-60">Trusted by 10,000+ customers</p>
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
  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {fragrances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-light">No featured products available.</p>
        </div>
      ) : (
        <>
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
                      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden group-hover:border-gray-200 group-hover:shadow-2xl transition-all duration-500 relative h-80 sm:h-96 group-hover:-translate-y-2">
                        {isValidImageUrl(fragrance.image) && !imageErrors[fragrance.id] ? (
                          <>
                            <img
                              src={fragrance.image}
                              alt={fragrance.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                              onError={() => handleImageError(fragrance.id)}
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
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
                      <div className="space-y-3 px-2 text-center">
                        <h3 className="text-xl sm:text-2xl font-serif font-light group-hover:text-black transition-colors">
                          {fragrance.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-light leading-relaxed line-clamp-2">
                          {fragrance.tagline}
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                          <span className="text-lg font-medium text-gray-900">Rs {fragrance.price}</span>
                        </div>
                        <span className="inline-block text-xs font-medium tracking-widest uppercase border-b border-transparent group-hover:border-black transition-all pb-0.5">
                          View Details
                        </span>
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
        </>
      )}
    </div>
  );
}