import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import Link from "next/link";

export const metadata = {
  title: "About Us | e'eora - Our Story, Philosophy, and Values",
  description:
    "Discover the story behind e'eora. Learn about our philosophy on quiet luxury, thoughtful design, and timeless fragrances. Explore our values of craftsmanship, minimalism, and authenticity.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section - Answer: Why this brand? */}
      <section className="pt-32 pb-24 border-b border-gray-200">
        <ScrollReveal className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-agrandir font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
            We believe in quiet luxury, thoughtful design, and timeless fragrance. Learn how <span className="font-agrandir">e'eora</span> came to be.
          </p>
        </ScrollReveal>
      </section>

      {/* Our Story Section */}
      <section className="py-24 md:py-32 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <ScrollReveal>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                <img
                  src="https://res.cloudinary.com/djb0ekljm/image/upload/v1768901373/Photoroom-20240724_161118-01.jpeg_t7ku2f.jpg"
                  alt="Perfume bottles on a minimalist setting"
                  className="w-full h-full object-cover aspect-[3/2] md:aspect-[4/3] lg:aspect-[5/4]"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-gray-900">
                  Our Philosophy
                </h2>
                <p className="text-lg text-gray-700 font-light leading-relaxed mb-4">
                  e&apos;eora began with a simple belief: that true elegance
                  requires restraint. In a world of excess, we chose simplicity.
                  In a culture of noise, we chose quiet.
                </p>
                <p className="text-lg text-gray-700 font-light leading-relaxed mb-4">
                  Each fragrance is crafted with intention, using only the
                  finest ingredients. We believe that a scent should evolve with
                  you throughout the day, becoming part of your story rather
                  than overshadowing it.
                </p>
                <p className="text-lg text-gray-700 font-light leading-relaxed">
                  From concept to bottle, every detail reflects our commitment
                  to quality and authenticity. e&apos;eora is not just a
                  fragrance—it&apos;s a philosophy.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-serif font-light text-center mb-16">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: "✨",
                title: "Craftsmanship",
                desc: "Meticulous attention to every detail. We work with master perfumers and ethically sourced ingredients to create fragrances that last."
              },
              {
                icon: "🌿",
                title: "Minimalism",
                desc: "Less is more. Our designs are clean and timeless. We believe elegance speaks loudly in silence."
              },
              {
                icon: "🤍",
                title: "Authenticity",
                desc: "No shortcuts. No unnecessary additives. Just pure, concentrated fragrance that tells a story."
              }
            ].map((value, index) => (
              <ScrollReveal key={index} delay={index * 80} className="text-center bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-serif font-light mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{value.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-24 md:py-32 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <ScrollReveal>
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 text-gray-900">
                  Our Commitment
                </h2>
                <p className="text-lg text-gray-700 font-light leading-relaxed mb-4">
                  In a world that celebrates excess, we celebrate restraint. Every e&apos;eora fragrance is a conversation between you and the scent—intimate, personal, never demanding.
                </p>
                <p className="text-lg text-gray-700 font-light leading-relaxed">
                  We source ingredients ethically. We create sustainably. We believe that luxury should enhance your life without compromising the world around us.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 group">
                <img
                  src="https://res.cloudinary.com/djb0ekljm/image/upload/v1768901362/Photoroom-20240724_161017-01.jpeg_jjw0b4.jpg"
                  alt="Close up of a perfume bottle and ingredients"
                  className="w-full h-full object-cover aspect-[3/2] md:aspect-[4/3] lg:aspect-[5/4] transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-light mb-6">
            Explore Our Collection
          </h2>
          <p className="text-gray-600 mb-8 font-light">
            Discover the fragrances that define quiet luxury
          </p>
          <Link href="/fragrances">
            <Button variant="primary">Shop Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
