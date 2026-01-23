"use client";

import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import Link from "next/link";
import { Gem, Feather, Heart, Droplets, Leaf, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#fafafa]">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-60" />
        <ScrollReveal className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium mb-6 block">
            Since 2024
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-agrandir font-bold text-gray-900 mb-8 tracking-tight leading-tight">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl mx-auto">
            We believe in quiet luxury, thoughtful design, and timeless fragrance. Learn how <span className="font-agrandir text-gray-900">e'eora</span> came to be.
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
                <img
                  src="https://res.cloudinary.com/djb0ekljm/image/upload/v1768901373/Photoroom-20240724_161118-01.jpeg_t7ku2f.jpg"
                  alt="Perfume bottles on a minimalist setting"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="pl-0 md:pl-10">
                <span className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium mb-4 block">
                  The Beginning
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 text-gray-900 leading-tight">
                  Our Philosophy
                </h2>
                <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                  <p>
                    <span className="font-agrandir text-gray-900">e'eora</span> began with a simple belief: that true elegance
                    requires restraint. In a world of excess, we chose simplicity.
                    In a culture of noise, we chose quiet.
                  </p>
                  <p>
                    Each fragrance is crafted with intention, using only the
                    finest ingredients. We believe that a scent should evolve with
                    you throughout the day, becoming part of your story rather
                    than overshadowing it.
                  </p>
                  <p>
                    From concept to bottle, every detail reflects our commitment
                    to quality and authenticity. <span className="font-agrandir text-gray-900">e'eora</span> is not just a
                    fragrance—it&apos;s a philosophy.
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
              What We Stand For
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900">
              Our Values
            </h2>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Gem,
                title: "Craftsmanship",
                desc: "Meticulous attention to every detail. We work with master perfumers to create fragrances that last."
              },
              {
                icon: Feather,
                title: "Minimalism",
                desc: "Less is more. Our designs are clean and timeless. We believe elegance speaks loudly in silence."
              },
              {
                icon: Heart,
                title: "Authenticity",
                desc: "No shortcuts. No unnecessary additives. Just pure, concentrated fragrance that tells a story."
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
                  Responsible Luxury
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-light mb-8 text-gray-900">
                  Our Commitment
                </h2>
                <div className="space-y-6 text-lg text-gray-600 font-light leading-relaxed">
                  <p>
                    In a world that celebrates excess, we celebrate restraint. Every <span className="font-agrandir text-gray-900">e'eora</span> fragrance is a conversation between you and the scent—intimate, personal, never demanding.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Leaf className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Ethical Sourcing</h4>
                        <p className="text-sm text-gray-500">Ingredients sourced with respect for nature and communities.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Droplets className="w-5 h-5 text-gray-700" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Sustainable Creation</h4>
                        <p className="text-sm text-gray-500">Processes designed to minimize environmental impact.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100} className="order-1 md:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50 group aspect-[4/5]">
                 <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src="https://res.cloudinary.com/djb0ekljm/image/upload/v1768901362/Photoroom-20240724_161017-01.jpeg_jjw0b4.jpg"
                  alt="Close up of a perfume bottle and ingredients"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
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
            Experience the Essence
          </h2>
          <p className="text-gray-300 mb-10 font-light text-lg md:text-xl max-w-xl mx-auto">
            Discover the fragrances that define quiet luxury and find your signature scent.
          </p>
          <Link href="/fragrances">
            <Button variant="primary" className="bg-white text-black hover:bg-gray-200 border-white">Shop Collection</Button>
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
