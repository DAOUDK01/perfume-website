"use client";

import Button from "@/src/components/Button";
import ScrollProgress from "@/src/components/ScrollProgress";
import ScrollReveal from "@/src/components/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentItem, getContent } from "@/src/types/content";

type FragranceItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image?: string;
};

export default function HomePage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        console.log("API Response Data:", data);
        if (res.ok) {
          if (Array.isArray(data.content)) {
            setContent(data.content.filter((item: ContentItem) => item.page === "Home") || []);
          } else {
            console.error("data.content is not an array:", data.content);
            setError("Invalid content format from API");
          }
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, []);

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
      setEmail("");
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



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <p className="text-gray-600">Loading home page content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <>


      <div className="bg-[#fafafa]">
        <ScrollProgress sections={sections} />



        {/* Hero — Fixed e'eora rendering with proper mobile sizing */}
        <section
          className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-white pt-20 md:pt-0"
          data-scroll-section="0"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-60 pointer-events-none" />
          
          <ScrollReveal className="max-w-4xl mx-auto text-center w-full relative z-10">
            <h1
              className="font-agrandir font-bold tracking-tighter text-[clamp(2.5rem,10vw,6rem)] sm:text-[clamp(3.5rem,12vw,8rem)] md:text-[clamp(4rem,15vw,10rem)] leading-[0.85] text-gray-900 mb-6 animate-fade-in-up md:leading-[0.9]"
              style={{ letterSpacing: "-0.05em" }}
              title="e'eora"
            >
              e'eora
            </h1>
            <div className="space-y-4 animate-fade-in-up delay-100">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 font-light tracking-wide">
                {getContent(content, "Hero", "Subtitle", "text", "A quiet expression of scent")}
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-400 font-light max-w-lg mx-auto leading-relaxed px-4">
                {getContent(content, "Hero", "Description", "text", "Thoughtfully crafted fragrances that speak softly, designed to linger in memory rather than dominate the room.")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mt-10 sm:mt-12 animate-fade-in-up delay-200">
              <Link href="/fragrances">
                <Button variant="primary" className="px-8 sm:px-10 py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                  Discover Collection
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" className="px-8 sm:px-10 py-4 text-base sm:text-lg w-full sm:w-auto">
                  Our Philosophy
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
            <div className="w-px h-12 sm:h-16 bg-gradient-to-b from-gray-300 to-transparent" />
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 sm:py-24 md:py-32 lg:py-40 bg-[#fafafa] border-t border-gray-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <ScrollReveal>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 font-light leading-relaxed">
                {getContent(content, "Philosophy", "Quote", "text", "We believe fragrance should be intentional, not loud. Each scent is designed to complement, not overwhelm.")}
              </p>
              <span className="inline-block mt-6 sm:mt-8 text-[10px] tracking-[0.35em] text-gray-400 uppercase">
                {getContent(content, "Philosophy", "Label", "text", "Philosophy")}
              </span>
            </ScrollReveal>
          </div>
        </section>

        {/* Why e'eora — three pillars */}
        <section
          className="py-20 sm:py-24 md:py-32 lg:py-40 bg-white"
          data-scroll-section="1"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ScrollReveal className="text-center mb-10 sm:mb-14 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-tight text-gray-900 mb-3 leading-tight">
                Why{' '}
                <span className="font-agrandir">e'eora</span>
              </h2>
              <p className="text-gray-500 font-light text-base sm:text-lg">
                {getContent(content, "Why e'eora", "Subtitle", "text", "Three pillars of our philosophy")}
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {[
                { 
                  number: getContent(content, "Why e'eora", "Pillar 1 Number", "text", "01"), 
                  title: getContent(content, "Why e'eora", "Pillar 1 Title", "text", "Carefully Selected"), 
                  desc: getContent(content, "Why e'eora", "Pillar 1 Description", "text", "Premium ingredients sourced responsibly from trusted suppliers. Each component is vetted for quality and sustainability.") 
                },
                { 
                  number: getContent(content, "Why e'eora", "Pillar 2 Number", "text", "02"), 
                  title: getContent(content, "Why e'eora", "Pillar 2 Title", "text", "Minimal Design"), 
                  desc: getContent(content, "Why e'eora", "Pillar 2 Description", "text", "Clean, timeless bottles that reflect understated elegance. Form follows function in every detail.") 
                },
                { 
                  number: getContent(content, "Why e'eora", "Pillar 3 Number", "text", "03"), 
                  title: getContent(content, "Why e'eora", "Pillar 3 Title", "text", "Long Lasting"), 
                  desc: getContent(content, "Why e'eora", "Pillar 3 Description", "text", "High concentration eau de parfum for all-day wear. Crafted to evolve beautifully on your skin.") 
                },
              ].map((item, i) => (
                <ScrollReveal
                  key={item.number}
                  delay={i * 150}
                  className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
                >
                  <span className="text-xs font-medium text-gray-400 tracking-[0.3em] group-hover:text-black transition-colors block mb-2">{item.number}</span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-light mt-4 sm:mt-6 mb-4 text-gray-900 leading-tight">{item.title}</h3>
                  <p className="text-gray-600 font-light text-sm sm:text-base leading-relaxed">{item.desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Collection */}
        <section
          className="py-20 sm:py-24 md:py-32 lg:py-40 bg-[#fafafa] border-t border-gray-100"
          data-scroll-section="2"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ScrollReveal className="text-center mb-10 sm:mb-14 md:mb-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light tracking-tight text-gray-900 mb-3 leading-tight">
                {getContent(content, "Featured Collection", "Title", "text", "Featured Collection")}
              </h2>
              <p className="text-gray-500 font-light text-base sm:text-lg">
                {getContent(content, "Featured Collection", "Subtitle", "text", "Select from our curated fragrances")}
              </p>
            </ScrollReveal>
            <ProductCarousel fragrances={featuredList} />
            <ScrollReveal className="text-center mt-8 sm:mt-12 md:mt-16">
              <Link href="/fragrances">
                <Button variant="secondary" className="px-8 sm:px-12 py-4 text-lg">Explore Full Collection</Button>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Craftsmanship */}
        <section className="py-20 sm:py-24 md:py-32 lg:py-40 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
              <ScrollReveal>
                <div className="rounded-2xl border border-gray-100 p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px] md:min-h-[460px] relative overflow-hidden">
                  <Image
                    src={getContent(content, "Craftsmanship", "Image", "image", "https://res.cloudinary.com/djb0ekljm/image/upload/v1769277918/OIP_nkiuae.webp")}
                    alt={getContent(content, "Craftsmanship", "Image Alt Text", "text", "Craftsmanship Image")}
                    fill
                    objectFit="contain"
                    className="object-center"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-light text-gray-900 mb-4 sm:mb-6 leading-tight">
                    {getContent(content, "Craftsmanship", "Title", "text", "Crafted with intention")}
                  </h3>
                  <p className="text-gray-600 font-light leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                    {getContent(content, "Craftsmanship", "Description 1", "text", "Every bottle is a result of careful consideration. We work with master perfumers to create scents that are both timeless and contemporary.")}
                  </p>
                  <p className="text-gray-500 font-light text-sm leading-relaxed mb-6 sm:mb-8">
                    {getContent(content, "Craftsmanship", "Description 2", "text", "Our commitment to quality means using only the finest ingredients, blended in precise concentrations for optimal performance and longevity.")}
                  </p>
                  <Link href="/about" className="inline-flex items-center gap-2 text-sm font-light border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                    {getContent(content, "Craftsmanship", "Button Text", "text", "Learn about our process")} <span>→</span>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Stay Updated */}
        <section
          className="py-20 sm:py-24 md:py-32 lg:py-40 bg-[#fafafa] border-t border-gray-100"
          data-scroll-section="3"
        >
          <ScrollReveal className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900 mb-4 sm:mb-6 leading-tight">
              {getContent(content, "Stay Updated", "Title", "text", "Stay Updated")}
            </h2>
            <p className="text-gray-600 font-light text-base sm:text-lg mb-2">
              {getContent(content, "Stay Updated", "Subtitle", "text", "New releases and exclusive offers")}
            </p>
            <p className="text-sm text-gray-400 mb-8 sm:mb-10 font-light">
              {getContent(content, "Stay Updated", "Description", "text", "Order updates and collection announcements only.")}
            </p>
           
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1 group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 sm:px-6 py-4 border border-gray-200 rounded-full text-base font-light focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white transition-all duration-300 placeholder:text-gray-300 shadow-sm group-hover:shadow-md"
                  required
                />
              </div>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isSubmitting} 
                className="rounded-full px-8 sm:px-10 py-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 whitespace-nowrap"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
           
            {message && (
              <div className={`mt-6 p-4 rounded-xl border max-w-md mx-auto ${message.includes("successfully") ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"} text-sm font-light animate-fade-in`}>
                {message}
              </div>
            )}
            <p className="mt-10 sm:mt-12 text-[10px] text-gray-400 tracking-widest uppercase opacity-60">Trusted by 10,000+ customers</p>
          </ScrollReveal>
          <div className="h-12 sm:h-16 md:h-24" />
        </section>
      </div>
    </>
  );
}

// ProductCarousel Component
function ProductCarousel({ fragrances }: { fragrances: any[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const isValidImageUrl = (image: string) => {
    return image && (image.startsWith('http') || image.startsWith('/') || image.startsWith('./'));
  };

  const scrollTo = (index: number) => {
    if (carouselRef.current && carouselRef.current.children[0]) {
      const container = carouselRef.current;
      const innerFlex = container.children[0] as HTMLElement;
      const slides = Array.from(innerFlex.children) as HTMLElement[];
      if (slides[index]) {
        const slideOffset = slides[index].offsetLeft;
        container.scrollTo({
          left: slideOffset,
          behavior: 'smooth',
        });
        setCurrentIndex(index);
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current && carouselRef.current.children[0]) {
        const container = carouselRef.current;
        const innerFlex = container.children[0] as HTMLElement;
        const slides = Array.from(innerFlex.children) as HTMLElement[];
        
        const scrollPosition = container.scrollLeft;
        const containerWidth = container.clientWidth;
        
        // Find which slide is most centered
        let closestIndex = 0;
        let minDistance = Infinity;
        
        slides.forEach((slide, index) => {
          const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
          const containerCenter = scrollPosition + containerWidth / 2;
          const distance = Math.abs(slideCenter - containerCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });
        
        setCurrentIndex(closestIndex);
      }
    };

    const container = carouselRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [fragrances.length]);

  const nextSlide = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = Math.min(prevIndex + 1, fragrances.length - 1);
      scrollTo(newIndex);
      return newIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => {
      const newIndex = Math.max(prevIndex - 1, 0);
      scrollTo(newIndex);
      return newIndex;
    });
  };

  return (
    <div className="relative">
      {fragrances.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 font-light text-base">No featured products available.</p>
        </div>
      ) : (
        <>
          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="overflow-x-auto hide-scrollbar pb-4 scroll-snap-x-mandatory"
          >
            <div className="flex gap-4 sm:gap-6 lg:gap-8">
              {fragrances.map((fragrance, index) => (
                <div 
                  key={`${fragrance.id}-${index}`} 
                  className="flex-none w-full sm:w-72 md:w-80 lg:w-1/4 flex flex-col snap-center"
                >
                  <Link
                    href={`/product/${fragrance.id}`}
                    className="group block flex flex-col h-full"
                  >
                    {/* Product Card with Image */}
                    <div className="flex-shrink-0 bg-white border border-gray-100 rounded-2xl overflow-hidden group-hover:border-gray-200 group-hover:shadow-2xl transition-all duration-500 relative aspect-[4/5] flex-grow group-hover:-translate-y-2">
                      {isValidImageUrl(fragrance.image) && !imageErrors[fragrance.id] ? (
                        <>
                          <Image
                            src={fragrance.image}
                            alt={fragrance.name}
                            fill
                            objectFit="contain"
                            className="group-hover:scale-110 transition-transform duration-700 ease-out object-center object-contain"
                            onError={() => handleImageError(fragrance.id)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-500" />
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors duration-500 p-6 sm:p-8">
                        <div className="text-4xl sm:text-5xl lg:text-7xl font-serif font-light text-gray-300 mb-3 sm:mb-4 group-hover:text-gray-400 transition-colors">
                          {fragrance.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="w-12 sm:w-16 h-px bg-gray-300 mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg lg:text-xl font-serif font-light text-gray-600 mb-1 sm:mb-2 text-center leading-tight">
                          {fragrance.name}
                        </h3>
                        <p className="text-xs tracking-widest text-gray-400 font-light">
                          EAU DE PARFUM
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow flex flex-col items-center text-center mt-4 sm:mt-6">
                    <h3 className="text-base sm:text-lg font-serif font-light text-gray-900 leading-tight">
                      {fragrance.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-light mt-1">
                      {fragrance.tagline}
                    </p>
                    <p className="text-sm sm:text-base font-medium text-gray-700 mt-2">
                      Rs {fragrance.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {fragrances.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? "bg-black w-6" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows (Desktop Only) */}
        <div className="hidden lg:block">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === fragrances.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </>
    )}
  </div>
);
}

