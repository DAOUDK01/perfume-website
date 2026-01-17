import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import Link from "next/link";

export const metadata = {
  title: "About e'eora | Why This Brand",
  description:
    "Discover why e'eora was founded. Our philosophy on quiet luxury, thoughtful design, and timeless fragrances.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section - Answer: Why this brand? */}
      <section className="pt-32 pb-24 border-b border-gray-200">
        <ScrollReveal className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-serif font-light mb-6">
            Why e&apos;eora
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            We believe in quiet luxury. Thoughtful design. Timeless fragrance.
          </p>
        </ScrollReveal>
      </section>

      {/* Story Section */}
      <section className="py-24 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="w-full h-96 rounded bg-gradient-to-br from-gray-300 to-gray-200" />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div>
                <h2 className="text-4xl font-serif font-light mb-6">
                  Our Philosophy
                </h2>
                <p className="text-gray-700 font-light leading-relaxed mb-4">
                  e&apos;eora began with a simple belief: that true elegance
                  requires restraint. In a world of excess, we chose simplicity.
                  In a culture of noise, we chose quiet.
                </p>
                <p className="text-gray-700 font-light leading-relaxed mb-4">
                  Each fragrance is crafted with intention, using only the
                  finest ingredients. We believe that a scent should evolve with
                  you throughout the day, becoming part of your story rather
                  than overshadowing it.
                </p>
                <p className="text-gray-700 font-light leading-relaxed">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Craftsmanship",
                desc: "Meticulous attention to every detail. We work with master perfumers and ethically sourced ingredients to create fragrances that last."
              },
              {
                title: "Minimalism",
                desc: "Less is more. Our designs are clean and timeless. We believe elegance speaks loudly in silence."
              },
              {
                title: "Authenticity",
                desc: "No shortcuts. No unnecessary additives. Just pure, concentrated fragrance that tells a story."
              }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-2xl font-serif font-light mb-4">{value.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-light mb-6">
                Our Philosophy
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                In a world that celebrates excess, we celebrate restraint. Every e&apos;eora fragrance is a conversation between you and the scent—intimate, personal, never demanding.
              </p>
              <p className="text-gray-700 font-light leading-relaxed">
                We source ingredients ethically. We create sustainably. We believe that luxury should enhance your life without compromising the world around us.
              </p>
            </div>
            <div>
              <div 
                className="w-full h-96 rounded bg-gradient-to-br from-gray-200 to-gray-100"
              ></div>
            </div>
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
