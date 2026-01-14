import Button from "@/src/components/Button";

export const metadata = {
  title: "About | e'eora",
  description: "Discover the story behind e'eora fragrances",
};

export default function AboutPage() {
  return (
    <div className="bg-white pt-32">
      {/* Hero Section */}
      <section className="py-24 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-light tracking-wider mb-12 leading-tight">
            The e&apos;eora Story
          </h1>
          <p className="text-xl font-light text-gray-700 leading-relaxed">
            In the quiet corners of luxury, where craftsmanship meets philosophy,
            e&apos;eora was born. Not from noise or necessity, but from the conviction
            that true elegance requires restraint, intention, and the passage of
            time.
          </p>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <img
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=600&fit=crop"
                alt="Craftsmanship"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-light tracking-wider mb-6">
                Timeless Craftsmanship
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                Every e&apos;eora fragrance is a result of meticulous research,
                thoughtful composition, and an unwavering commitment to quality.
                We source the finest raw materials from around the world,
                partnering with master perfumers who understand that true luxury
                cannot be rushed.
              </p>
              <p className="text-gray-700 font-light leading-relaxed">
                Our formulations are concentrated and enduring, meant to evolve
                with your skin throughout the day—a living, breathing companion
                rather than a fleeting impression.
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-200 my-24" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-light tracking-wider mb-6">
                Pure Ingredients
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We believe in transparency. e&apos;eora fragrances contain no
                synthetic fillers or unnecessary additives. Each note serves a
                purpose, each ingredient a story.
              </p>
              <p className="text-gray-700 font-light leading-relaxed">
                Our commitment to ethical sourcing ensures that luxury comes
                without compromise—for you, and for the world we share.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&h=600&fit=crop"
                alt="Ingredients"
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>

          <div className="h-px bg-gray-200 my-24" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1595955707802-6b2ecef7cc14?w=500&h=600&fit=crop"
                alt="Philosophy"
                className="w-full aspect-square object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl font-light tracking-wider mb-6">
                Quiet Luxury
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-4">
                We reject loud marketing in favor of authentic storytelling. An
                e&apos;eora fragrance speaks for itself—a whisper rather than a
                shout.
              </p>
              <p className="text-gray-700 font-light leading-relaxed">
                Our community consists of those who understand that true luxury
                is not about being seen—it&apos;s about being felt. It&apos;s an
                essence beyond presence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-light tracking-wider mb-16 text-center">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-light tracking-wide mb-4">Integrity</h3>
              <p className="text-gray-600 font-light leading-relaxed">
                Every fragrance is honest. No pretense, no excess. Just pure,
                intentional composition.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-light tracking-wide mb-4">
                Sustainability
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We honor the earth. Ethical sourcing and sustainable practices
                are non-negotiable.
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-light tracking-wide mb-4">
                Timelessness
              </h3>
              <p className="text-gray-600 font-light leading-relaxed">
                We create fragrances that transcend trends. Meant to be cherished
                for years to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light tracking-wider mb-6">
            Join Our Journey
          </h2>
          <p className="text-lg text-gray-700 font-light mb-12 leading-relaxed">
            Experience the e&apos;eora difference. Discover fragrances designed
            for those who understand that luxury whispers rather than shouts.
          </p>
          <Button variant="primary">EXPLORE OUR FRAGRANCES</Button>
        </div>
      </section>
    </div>
  );
}
