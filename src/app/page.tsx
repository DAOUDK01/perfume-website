"use client";

import Button from "@/components/Button";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ContentItem, getContent } from "@/types/content";

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
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        console.log("API Response Data:", data);
        if (res.ok) {
          if (Array.isArray(data.content)) {
            setContent(
              data.content.filter(
                (item: ContentItem) => item.page === "Home",
              ) || [],
            );
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
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    const scrollToHashSection = () => {
      const rawHash = window.location.hash;
      if (!rawHash) return;

      const targetId = decodeURIComponent(rawHash.replace(/^#/, ""));
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      target.scrollIntoView({ behavior: "auto", block: "start" });
    };

    const timer = window.setTimeout(scrollToHashSection, 120);
    window.addEventListener("hashchange", scrollToHashSection);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHashSection);
    };
  }, [loading]);

  useEffect(() => {
    const slideTimer = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % 2);
    }, 4500);

    return () => {
      window.clearInterval(slideTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa] ">
        <p className="text-gray-600 ">Loading home page content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa] ">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const philosophySource = getContent(
    content,
    "Philosophy",
    "Quote",
    "text",
    "We believe fragrance should be intentional, not loud. Each scent is designed to complement, not overwhelm.",
  );

  const firstPhilosophySentence = philosophySource
    .split(".")
    .map((sentence) => sentence.trim())
    .find(Boolean);

  const philosophyQuote = firstPhilosophySentence
    ? `${firstPhilosophySentence}.`
    : "Fragrance should feel quiet and intentional.";

  const featuredStoryImage =
    "https://res.cloudinary.com/djb0ekljm/image/upload/v1777026902/Gemini_Generated_Image_6t2le76t2le76t2l_upmov5.png";

  const heroBannerImage =
    "https://res.cloudinary.com/djb0ekljm/image/upload/v1777143245/b1628cb8-edec-4b26-986d-b0ac5a39a394_cyxep3.png";

  const heroCarouselImages = [
    heroBannerImage,
    "https://res.cloudinary.com/djb0ekljm/image/upload/v1777143715/9adba9f6-a8d1-4452-9656-38061cd04178_jlucyl.png",
  ];

  return (
    <>
      <div className="bg-[#fafafa] ">
        {/* Hero - Clean minimal design */}
        <section
          className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden bg-white pt-20 md:pt-24"
          data-scroll-section="0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/10 to-transparent  opacity-30 pointer-events-none" />
          <div
            className="absolute top-20 left-10 w-32 h-32 bg-gray-100  rounded-full opacity-10 blur-3xl animate-float"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="absolute bottom-20 right-10 w-40 h-40 bg-gray-200  rounded-full opacity-10 blur-3xl animate-float"
            style={{ animationDelay: "1.3s" }}
          />

          <ScrollReveal className="relative z-10 w-full max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-gray-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
              <div className="grid lg:grid-cols-[1.45fr_0.85fr] min-h-[70vh] lg:min-h-[78vh]">
                <div className="relative order-2 lg:order-1 min-h-[28rem] lg:min-h-full">
                  {heroCarouselImages.map((src, index) => (
                    <Image
                      key={src}
                      src={src}
                      alt={`e'eora hero banner ${index + 1}`}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      className={`object-cover object-center transition-opacity duration-700 ${
                        activeHeroSlide === index ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-black/8 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />

                  <div className="absolute bottom-5 left-5 z-20 flex items-center gap-2">
                    {heroCarouselImages.map((_, index) => (
                      <button
                        key={`hero-dot-${index}`}
                        type="button"
                        aria-label={`Show hero image ${index + 1}`}
                        onClick={() => setActiveHeroSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          activeHeroSlide === index
                            ? "w-7 bg-white"
                            : "w-2 bg-white/60 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="order-1 lg:order-2 flex items-end lg:items-center bg-gradient-to-br from-white via-white to-gray-50 px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14">
                  <div className="w-full max-w-xl">
                    <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-gray-500 font-medium mb-5">
                      A Gentle Trace
                    </span>

                    <h1
                      className="font-agrandir font-semibold tracking-tighter text-[clamp(3rem,7vw,6.5rem)] leading-[0.84] text-gray-950 mb-5 md:mb-6 animate-fade-in-up"
                      style={{ letterSpacing: "-0.055em" }}
                      title="e'eora"
                    >
                      e'eora
                    </h1>

                    <div className="space-y-4 animate-fade-in-up delay-100">
                      <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-light tracking-wide max-w-md">
                        Quiet, but unforgettable
                      </p>
                      <p className="text-sm sm:text-base text-gray-500 font-light max-w-md leading-relaxed">
                        Thoughtfully composed fragrances that settle softly on
                        the skin, leaving an impression that stays, never
                        overwhelms.
                      </p>
                    </div>

                    <div className="flex flex-row flex-nowrap items-center gap-2 sm:gap-4 mt-8 sm:mt-10 animate-fade-in-up delay-200">
                      <Link href="/fragrances" className="inline-flex">
                        <Button className="px-4 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-base font-medium bg-gray-900 hover:bg-black text-white shadow-md hover:shadow-lg rounded-full transition-all duration-300 whitespace-nowrap">
                          Discover the Collection
                        </Button>
                      </Link>
                      <Link href="/policies" className="inline-flex">
                        <Button
                          variant="secondary"
                          className="px-4 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-base border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-100 text-gray-900 transition-all duration-300 transform hover:scale-105 rounded-full whitespace-nowrap"
                        >
                          Our Policies
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Philosophy */}
        <section className="py-20 sm:py-24 md:py-32 lg:py-40 bg-white  border-t border-gray-200  overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
            <div className="absolute -top-8 left-8 h-36 w-36 rounded-full bg-gray-100/80 blur-3xl" />
            <div className="absolute bottom-0 right-8 h-44 w-44 rounded-full bg-gray-100/70 blur-3xl" />

            <ScrollReveal>
              <div className="relative rounded-[1.75rem] border border-gray-200/80 bg-white/55 px-6 py-8 sm:px-10 sm:py-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(15,23,42,0.05)] text-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(243,244,246,0.3))]" />
                <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
                <div className="absolute left-6 top-6 h-14 w-14 rounded-xl border border-white/70 bg-white/30 opacity-70" />
                <div className="absolute right-8 bottom-6 h-10 w-10 rounded-xl border border-white/60 bg-white/20 opacity-60" />

                <span className="relative z-10 inline-block text-[10px] tracking-[0.35em] text-gray-500  uppercase font-medium mb-5 sm:mb-6">
                  {getContent(
                    content,
                    "Philosophy",
                    "Label",
                    "text",
                    "Philosophy",
                  )}
                </span>
                <blockquote className="relative z-10 text-[clamp(1.35rem,2.8vw,2.4rem)] font-serif font-light tracking-tight text-gray-900  leading-[1.18] max-w-3xl mx-auto text-balance">
                  “{philosophyQuote}”
                </blockquote>
                <p className="relative z-10 mt-4 text-sm sm:text-base text-gray-600  font-light leading-relaxed max-w-xl mx-auto">
                  A soft presence, a clean signature, and a finish that stays
                  close to the skin.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Featured Story */}
        <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-white  border-t border-gray-200  overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <ScrollReveal className="lg:col-span-7 h-full">
                <div className="relative h-full min-h-[340px] sm:min-h-[430px] lg:min-h-[520px] rounded-[2rem] border border-gray-200  overflow-hidden bg-gray-50  group shadow-[0_22px_70px_rgba(15,23,42,0.07)]">
                  <Image
                    src={featuredStoryImage}
                    alt="The personality behind e'eora"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/18 via-transparent to-white/25" />
                  <div className="absolute left-5 top-5 bg-white/80  backdrop-blur-md px-4 py-2 rounded-full border border-white/75">
                    <span className="text-[10px] tracking-[0.25em] text-gray-700  uppercase font-medium">
                      Personality Edit
                    </span>
                  </div>
                  <div className="absolute right-5 bottom-5 bg-white/78  backdrop-blur-md px-4 py-2 rounded-full border border-white/70">
                    <span className="text-[10px] tracking-[0.25em] text-gray-700  uppercase font-medium">
                      Quiet Luxury
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={120} className="lg:col-span-5 h-full">
                <div className="h-full min-h-[340px] sm:min-h-[430px] lg:min-h-[520px] rounded-[1.75rem] border border-gray-200/80 bg-white/60  backdrop-blur-lg px-6 py-8 sm:px-8 sm:py-10 shadow-[0_18px_55px_rgba(15,23,42,0.05)] flex flex-col text-left">
                  <span className="inline-block text-[10px] tracking-[0.35em] text-gray-500  uppercase font-medium mb-4">
                    Featured Story
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-light text-gray-900  leading-tight mb-5">
                    The personality behind the scent
                  </h2>
                  <p className="text-gray-700  font-light leading-relaxed text-sm sm:text-base mb-6">
                    Crafted for presence without noise, this profile reflects a
                    fragrance identity that feels polished, calm, and lasting.
                  </p>

                  <div className="space-y-4 mb-7 flex-1">
                    {[
                      {
                        label: "Quiet",
                        value:
                          "Soft projection designed to stay elegant in close moments.",
                      },
                      {
                        label: "Balanced",
                        value:
                          "Notes transition smoothly from opening to dry-down.",
                      },
                      {
                        label: "Memorable",
                        value:
                          "A clear identity that lingers gently through the day.",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="grid grid-cols-[110px_1fr] gap-3 items-start"
                      >
                        <span className="text-[11px] tracking-[0.25em] uppercase text-gray-500  font-medium pt-1 whitespace-nowrap">
                          {item.label}:
                        </span>
                        <p className="text-sm text-gray-600  font-light leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/fragrances"
                      className="inline-flex items-center gap-2 text-sm font-medium text-gray-900  border-b-2 border-gray-200 hover:border-black   pb-1 transition-all duration-300"
                    >
                      Explore the collection
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Featured Collection */}
        <section
          id="featured-collection"
          className="scroll-mt-28 py-20 sm:py-24 md:py-32 lg:py-40 bg-gray-50  border-t border-gray-200 "
          data-scroll-section="1"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <div className="absolute -top-16 left-6 h-40 w-40 rounded-full bg-white/80 blur-3xl" />
            <div className="absolute bottom-10 right-0 h-56 w-56 rounded-full bg-gray-200/50 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/85 backdrop-blur-xl shadow-[0_26px_90px_rgba(15,23,42,0.08)]">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(249,250,251,0.9))]" />
              <div className="relative px-4 py-10 sm:px-6 sm:py-12 md:px-10 md:py-14 lg:px-12 lg:py-16">
                <ScrollReveal className="mb-10 sm:mb-12 md:mb-14">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl text-center lg:text-left">
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.32em] text-gray-500 shadow-sm">
                        Curated Fragrances
                      </span>
                      <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-tight text-gray-950 leading-[1.02]">
                        {getContent(
                          content,
                          "Featured Collection",
                          "Title",
                          "text",
                          "Featured Collection",
                        )}
                      </h2>
                      <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                        {getContent(
                          content,
                          "Featured Collection",
                          "Subtitle",
                          "text",
                          "Select from our curated fragrances",
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-center lg:justify-end gap-3">
                      <Link
                        href="/fragrances"
                        className="hidden sm:inline-flex"
                      >
                        <Button
                          variant="secondary"
                          className="px-5 py-3 rounded-full bg-gray-900 hover:bg-black text-white border border-gray-900 shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                        >
                          View all
                        </Button>
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>

                <FeaturedProductGrid fragrances={featuredList} />

                <ScrollReveal className="mt-8 sm:mt-10 md:mt-12 text-center">
                  <Link href="/fragrances" className="inline-flex sm:hidden">
                    <Button
                      variant="secondary"
                      className="px-8 sm:px-12 py-4 text-lg rounded-full bg-gray-900 hover:bg-black text-white border border-gray-900 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      Explore Full Collection
                    </Button>
                  </Link>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Craftsmanship */}
        <section className="py-20 sm:py-24 md:py-32 lg:py-40 bg-white  border-t border-gray-200 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
              <ScrollReveal>
                <div className="rounded-2xl border-2 border-gray-200  p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px] md:min-h-[460px] relative overflow-hidden bg-gray-50 ">
                  <Image
                    src={getContent(
                      content,
                      "Craftsmanship",
                      "Image",
                      "image",
                      "https://res.cloudinary.com/djb0ekljm/image/upload/v1773665520/Gemini_Generated_Image_spf0k2spf0k2spf0_odmrkg.png",
                    )}
                    alt={getContent(
                      content,
                      "Craftsmanship",
                      "Image Alt Text",
                      "text",
                      "Craftsmanship Image",
                    )}
                    fill
                    className="object-contain object-center relative z-10"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-light text-gray-900  mb-4 sm:mb-6 leading-tight relative z-10">
                    {getContent(
                      content,
                      "Craftsmanship",
                      "Title",
                      "text",
                      "Crafted with intention",
                    )}
                  </h3>
                  <p className="text-gray-700  font-light leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base relative z-10">
                    {getContent(
                      content,
                      "Craftsmanship",
                      "Description 1",
                      "text",
                      "Every bottle is a result of careful consideration. We work with master perfumers to create scents that are both timeless and contemporary.",
                    )}
                  </p>
                  <p className="text-gray-600  font-light text-sm leading-relaxed mb-6 sm:mb-8 relative z-10">
                    {getContent(
                      content,
                      "Craftsmanship",
                      "Description 2",
                      "text",
                      "Our commitment to quality means using only the finest ingredients, blended in precise concentrations for optimal performance and longevity.",
                    )}
                  </p>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-gray-800 hover:border-black hover:bg-gray-50 transition-all duration-300"
                  >
                    Learn about our process
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Stay Updated */}
        <section
          className="relative py-20 sm:py-24 md:py-32 lg:py-40 border-t border-gray-200 overflow-hidden bg-gray-50"
          data-scroll-section="3"
        >
          {/* Background overlays */}
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 via-white/20 to-gray-100/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100/30 to-transparent pointer-events-none" />

          <ScrollReveal className="max-w-xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-gray-900  mb-4 sm:mb-6 leading-tight">
              {getContent(
                content,
                "Stay Updated",
                "Title",
                "text",
                "Stay Updated",
              )}
            </h2>
            <p className="text-gray-600  font-light text-base sm:text-lg mb-2">
              {getContent(
                content,
                "Stay Updated",
                "Subtitle",
                "text",
                "New releases and exclusive offers",
              )}
            </p>
            <p className="text-sm text-gray-400  mb-8 sm:mb-10 font-light">
              {getContent(
                content,
                "Stay Updated",
                "Description",
                "text",
                "Order updates and collection announcements only.",
              )}
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <div className="relative flex-1 group">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 sm:px-6 py-4 border border-gray-200  rounded-full text-base font-light focus:outline-none focus:border-black  focus:ring-1 focus:ring-black  bg-white  transition-all duration-300 placeholder:text-gray-300  shadow-sm group-hover:shadow-md"
                  required
                />
              </div>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 bg-gray-900 hover:bg-black text-white    shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform hover:scale-105 whitespace-nowrap text-sm sm:text-base font-medium"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            {message && (
              <div
                className={`mt-6 p-4 rounded-xl border max-w-md mx-auto ${message.includes("successfully") ? "bg-green-50  border-green-100  text-green-800 " : "bg-red-50  border-red-100  text-red-800 "} text-sm font-light animate-fade-in`}
              >
                {message}
              </div>
            )}
            <p className="mt-10 sm:mt-12 text-[10px] text-gray-400  tracking-widest uppercase opacity-60">
              Trusted by 10,000+ customers
            </p>
          </ScrollReveal>
          <div className="h-12 sm:h-16 md:h-24" />
        </section>
      </div>
    </>
  );
}

// FeaturedProductGrid Component - Carousel Implementation
function FeaturedProductGrid({ fragrances }: { fragrances: FragranceItem[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {},
  );
  const carouselRef = useRef<HTMLDivElement | null>(null);

  type SlideItem = FragranceItem | { id: string; isPlaceholder: true };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const isValidImageUrl = (image?: string) => {
    return (
      image &&
      (image.startsWith("http") ||
        image.startsWith("/") ||
        image.startsWith("./"))
    );
  };

  // 1 card on mobile, 2 on tablet, 3 on desktop.
  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
        return;
      }

      if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
        return;
      }

      setItemsPerSlide(3);
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  const totalSlides = Math.max(1, Math.ceil(fragrances.length / itemsPerSlide));

  // Keep current slide valid whenever data/responsive layout changes.
  useEffect(() => {
    if (currentSlide > totalSlides - 1) {
      setCurrentSlide(Math.max(0, totalSlides - 1));
    }
  }, [currentSlide, totalSlides]);

  // Reset to first slide when viewport layout changes.
  useEffect(() => {
    setCurrentSlide(0);
  }, [itemsPerSlide]);

  const slides: SlideItem[][] = Array.from(
    {
      length: totalSlides,
    },
    (_, slideIndex) => {
      const start = slideIndex * itemsPerSlide;
      const products = fragrances.slice(start, start + itemsPerSlide);

      // Add placeholders to keep spacing even on last slide.
      const placeholders = Array.from({
        length: Math.max(0, itemsPerSlide - products.length),
      }).map((_, placeholderIndex) => ({
        id: `placeholder-${slideIndex}-${placeholderIndex}`,
        isPlaceholder: true as const,
      }));

      return [...products, ...placeholders];
    },
  );

  const columnsClass =
    itemsPerSlide === 1
      ? "grid-cols-1"
      : itemsPerSlide === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  const nextSlide = () => {
    if (!carouselRef.current) return;

    const nextIndex = (currentSlide + 1) % totalSlides;
    carouselRef.current.scrollTo({
      left: nextIndex * carouselRef.current.clientWidth,
      behavior: "smooth",
    });
    setCurrentSlide(nextIndex);
  };

  const prevSlide = () => {
    if (!carouselRef.current) return;

    const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
    carouselRef.current.scrollTo({
      left: prevIndex * carouselRef.current.clientWidth,
      behavior: "smooth",
    });
    setCurrentSlide(prevIndex);
  };

  const goToSlide = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: "smooth",
      });
    }
    setCurrentSlide(index);
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;

    const slideWidth = carouselRef.current.clientWidth;
    if (slideWidth === 0) return;

    const index = Math.round(carouselRef.current.scrollLeft / slideWidth);
    const boundedIndex = Math.max(0, Math.min(index, totalSlides - 1));

    if (boundedIndex !== currentSlide) {
      setCurrentSlide(boundedIndex);
    }
  };

  useEffect(() => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollTo({ left: 0, behavior: "auto" });
  }, [itemsPerSlide, fragrances.length]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {fragrances.length === 0 ? (
        <div className="text-center py-14 sm:py-16 bg-white/80 backdrop-blur-sm rounded-[2rem] border border-gray-200 mx-4 sm:mx-0 shadow-[0_18px_55px_rgba(15,23,42,0.05)]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center shadow-inner">
            <div className="text-gray-600 text-2xl">🌸</div>
          </div>
          <p className="text-gray-600 font-light text-base px-4">
            No featured products available at the moment.
          </p>
          <p className="text-sm text-gray-500 mt-2 px-4">
            Check back soon for our latest collection!
          </p>
        </div>
      ) : (
        <>
          {/* Carousel Container */}
          <div className="relative overflow-y-visible pt-2">
            {/* Navigation Arrows - Desktop */}
            <button
              onClick={prevSlide}
              className="absolute left-1 sm:left-3 top-1/2 transform -translate-y-1/2 z-10 hidden md:flex h-11 w-11 items-center justify-center bg-white/95 backdrop-blur border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={totalSlides <= 1}
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-1 sm:right-3 top-1/2 transform -translate-y-1/2 z-10 hidden md:flex h-11 w-11 items-center justify-center bg-white/95 backdrop-blur border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-300"
              disabled={totalSlides <= 1}
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Carousel Track (scrollable) */}
            <div
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              className="px-0 sm:px-10 lg:px-14 overflow-x-auto overflow-y-visible snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Featured products carousel"
            >
              <div className="flex w-full">
                {slides.map((slideItems, slideIndex) => (
                  <div
                    key={slideIndex}
                    className={`w-full flex-shrink-0 snap-start ${slideIndex < totalSlides - 1 ? "pr-6 sm:pr-8" : ""} px-3 sm:px-0 flex justify-center items-start`}
                  >
                    <div
                      className={`grid ${columnsClass} gap-4 sm:gap-5 md:gap-6 max-w-[360px] sm:max-w-[540px] md:max-w-none mx-auto w-full`}
                    >
                      {slideItems.map((slideItem, index) => {
                        if ("isPlaceholder" in slideItem) {
                          return (
                            <div
                              key={slideItem.id}
                              className="invisible h-full min-h-[340px] sm:min-h-[380px]"
                              aria-hidden="true"
                            />
                          );
                        }

                        const fragrance = slideItem;

                        return (
                          <ScrollReveal
                            key={`${fragrance.id}-${slideIndex}-${index}`}
                            delay={index * 100}
                            className="group h-full w-full"
                          >
                            <Link
                              href={`/product/${fragrance.id}`}
                              className="block h-full w-full"
                            >
                              <div className="bg-white rounded-[1.75rem] border border-gray-200 overflow-hidden hover:shadow-[0_20px_60px_rgba(15,23,42,0.12)] transition-all duration-300 group h-full flex flex-col min-h-[340px] sm:min-h-[380px] w-full">
                                <div className="relative aspect-[5/6] bg-gray-50 overflow-hidden">
                                  {isValidImageUrl(fragrance.image) &&
                                  !imageErrors[fragrance.id] ? (
                                    <Image
                                      src={fragrance.image!}
                                      alt={fragrance.name}
                                      fill
                                      style={{ objectFit: "cover" }}
                                      className="group-hover:scale-105 transition-transform duration-700 ease-out"
                                      onError={() =>
                                        handleImageError(fragrance.id)
                                      }
                                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-[linear-gradient(180deg,#fafafa,#f3f4f6)] transition-all duration-500 p-6">
                                      <div className="text-3xl sm:text-4xl font-serif font-light text-gray-700 mb-3 group-hover:scale-110 transition-transform duration-300">
                                        {fragrance.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="w-12 h-px bg-gray-300 mb-3" />
                                      <h3 className="text-base sm:text-lg font-serif font-light text-gray-800 mb-1 text-center leading-tight">
                                        {fragrance.name}
                                      </h3>
                                      <p className="text-xs tracking-widest text-gray-500 font-light">
                                        EAU DE PARFUM
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <div className="p-5 sm:p-6 space-y-4 flex-grow flex flex-col justify-between">
                                  <div className="text-center space-y-2">
                                    <h3 className="text-lg sm:text-xl font-serif font-medium text-gray-950 leading-tight">
                                      {fragrance.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 font-light line-clamp-2 min-h-[2.75rem] leading-relaxed">
                                      {fragrance.tagline}
                                    </p>
                                  </div>

                                  <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-900 mb-3">
                                      Rs {fragrance.price.toFixed(2)}
                                    </p>
                                    <div className="w-full h-10 rounded-full border border-gray-900 bg-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                      <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
                                        Shop Now
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </ScrollReveal>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          {totalSlides > 1 && (
            <div className="flex justify-center space-x-2 mt-6 sm:mt-8">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-[6px] h-[6px] sm:w-[8px] sm:h-[8px] rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-gray-900  scale-110"
                      : "bg-gray-300  hover:bg-gray-500 "
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
