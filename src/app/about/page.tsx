"use client";

import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import Link from "next/link";
import { Gem, Feather, Heart, Droplets, Leaf, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { ContentItem, getContent } from "@/src/types/content";
import Image from "next/image";

export default function AboutPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        if (res.ok) {
          setContent(data.content.filter((item: ContentItem) => item.page === "About") || []);
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



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <p className="text-gray-600">Loading about page content...</p>
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
    <div className="bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-60" />
        <ScrollReveal className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium mb-6 block">
            {getContent(content, "Hero", "Subtitle", "text", "Since 2024")}
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-agrandir font-bold text-gray-900 mb-8 tracking-tight leading-tight">
            {getContent(content, "Hero", "Title", "text", "Our Story")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            {getContent(content, "Hero", "Description", "text", "We believe in quiet luxury, thoughtful design, and timeless fragrance. Learn how e&apos;eora came to be.")}
          </p>
        </ScrollReveal>
      </section>

      {/* Our Story Section */}
      <section className="py-24 md:py-32 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <ScrollReveal>
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 group aspect-[4/5]">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <Image
                  src={getContent(content, "Our Story", "Image", "image", "https://res.cloudinary.com/djb0ekljm/image/upload/v1768901373/Photoroom-20240724_161118-01.jpeg_t7ku2f.jpg")}
                  alt={getContent(content, "Our Story", "Image Alt Text", "text", "Perfume bottles on a minimalist setting")}
                  fill
                  objectFit="cover"
                  className="transition-transform duration-1000 ease-out group-hover:scale-110"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="pl-0 md:pl-10">
                <span className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium mb-4 block">
                  {getContent(content, "Our Story", "Subtitle", "text", "The Beginning")}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 text-gray-900 leading-tight">
                  {getContent(content, "Our Story", "Title", "text", "Our Philosophy")}
                </h2>
                <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                  <p>
                    {getContent(content, "Our Story", "Paragraph 1", "text", "e&apos;eora began with a simple belief: that true elegance requires restraint. In a world of excess, we chose simplicity. In a culture of noise, we chose quiet.")}
                  </p>
                  <p>
                    {getContent(content, "Our Story", "Paragraph 2", "text", "Each fragrance is crafted with intention, using only the finest ingredients. We believe that a scent should evolve with you throughout the day, becoming part of your story rather than overshadowing it.")}
                  </p>
                  <p>
                    {getContent(content, "Our Story", "Paragraph 3", "text", "From concept to bottle, every detail reflects our commitment to quality and authenticity. e&apos;eora is not just a fragrance—it's a philosophy.")}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-[#fafafa] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="text-center mb-20">
            <span className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium mb-4 block">
              {getContent(content, "Values", "Subtitle", "text", "What We Stand For")}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900">
              {getContent(content, "Values", "Title", "text", "Our Values")}
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gem,
                title: getContent(content, "Values", "Card 1 Title", "text", "Craftsmanship"),
                desc: getContent(content, "Values", "Card 1 Description", "text", "Meticulous attention to every detail. We work with master perfumers to create fragrances that last.")
              },
              {
                icon: Feather,
                title: getContent(content, "Values", "Card 2 Title", "text", "Minimalism"),
                desc: getContent(content, "Values", "Card 2 Description", "text", "Less is more. Our designs are clean and timeless. We believe elegance speaks loudly in silence.")
              },
              {
                icon: Heart,
                title: getContent(content, "Values", "Card 3 Title", "text", "Authenticity"),
                desc: getContent(content, "Values", "Card 3 Description", "text", "No shortcuts. No unnecessary additives. Just pure, concentrated fragrance that tells a story.")
              }
            ].map((value, index) => (
              <ScrollReveal 
                key={index} 
                delay={index * 100} 
                className="group relative bg-white p-10 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-all duration-500 group-hover:scale-150 group-hover:bg-gray-100" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-8 text-gray-900 group-hover:bg-black group-hover:text-white transition-colors duration-500">
                    <value.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-serif font-light mb-4 text-gray-900">{value.title}</h3>
                  <p className="text-gray-500 font-light leading-relaxed">{value.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-24 md:py-32 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <ScrollReveal className="order-2 md:order-1">
              <div className="pr-0 md:pr-10">
                <span className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium mb-4 block">
                  {getContent(content, "Commitment", "Subtitle", "text", "Responsible Luxury")}
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 text-gray-900">
                  {getContent(content, "Commitment", "Title", "text", "Our Commitment")}
                </h2>
                <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                  <p>
                    {getContent(content, "Commitment", "Paragraph 1", "text", "In a world that celebrates excess, we celebrate restraint. Every e&apos;eora fragrance is a conversation between you and the scent—intimate, personal, never demanding.")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Leaf className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {getContent(content, "Commitment", "Feature 1 Title", "text", "Ethical Sourcing")}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {getContent(content, "Commitment", "Feature 1 Description", "text", "Ingredients sourced with respect for nature and communities.")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Droplets className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {getContent(content, "Commitment", "Feature 2 Title", "text", "Sustainable Creation")}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {getContent(content, "Commitment", "Feature 2 Description", "text", "Processes designed to minimize environmental impact.")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100} className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 group aspect-[4/5]">
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <Image
                  src={getContent(content, "Commitment", "Image", "image", "https://res.cloudinary.com/djb0ekljm/image/upload/v1768901362/Photoroom-20240724_161017-01.jpeg_jjw0b4.jpg")}
                  alt={getContent(content, "Commitment", "Image Alt Text", "text", "Close up of a perfume bottle and ingredients")}
                  fill
                  objectFit="cover"
                  className="transition-transform duration-1000 ease-out group-hover:scale-110"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] mix-blend-overlay"></div>
        <ScrollReveal className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-8">
            {getContent(content, "CTA", "Title", "text", "Experience the Essence")}
          </h2>
          <p className="text-gray-300 mb-10 font-light text-lg md:text-xl max-w-xl mx-auto">
            {getContent(content, "CTA", "Description", "text", "Discover the fragrances that define quiet luxury and find your signature scent.")}
          </p>
          <Link href="/fragrances">
            <Button variant="primary" className="bg-white text-black hover:bg-gray-200 border-white">
              {getContent(content, "CTA", "Button Text", "text", "Shop Collection")}
            </Button>
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
