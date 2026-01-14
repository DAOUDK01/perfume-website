import Button from "@/src/components/Button";

export const metadata = {
  title: "Journal | e'eora",
  description: "Stories, insights, and fragrance education from e'eora",
};

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "The Art of Fragrance Layering",
    excerpt:
      "Discover how to create your signature scent through the ancient art of fragrance layering. Explore techniques used by luxury houses worldwide.",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=400&fit=crop",
    date: "January 10, 2024",
  },
  {
    id: 2,
    title: "Understanding Fragrance Notes",
    excerpt:
      "A deep dive into the poetry of perfumery. Learn how top, heart, and base notes create a symphony of scent that evolves over time.",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop",
    date: "January 5, 2024",
  },
  {
    id: 3,
    title: "Sourcing Luxury: Our Ingredient Journey",
    excerpt:
      "Behind every bottle is a story of craftsmanship. Explore where our most precious ingredients come from and why quality matters.",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=400&fit=crop",
    date: "December 28, 2023",
  },
  {
    id: 4,
    title: "Seasonal Scents: Fragrance for Every Season",
    excerpt:
      "How to select fragrances that complement the seasons. From fresh florals in spring to warm woods in winter.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    date: "December 20, 2023",
  },
  {
    id: 5,
    title: "The Olfactory Memory",
    excerpt:
      "Why certain scents trigger vivid memories. Explore the profound connection between fragrance and the human mind.",
    image:
      "https://images.unsplash.com/photo-1595955707802-6b2ecef7cc14?w=600&h=400&fit=crop",
    date: "December 15, 2023",
  },
  {
    id: 6,
    title: "Fragrance Longevity: Making Your Scent Last",
    excerpt:
      "Expert tips on how to maximize the longevity of your fragrance. Learn the science behind scent projection and wear.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
    date: "December 8, 2023",
  },
];

export default function JournalPage() {
  return (
    <div className="bg-white pt-32">
      {/* Page Header */}
      <section className="border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4">
            Journal
          </h1>
          <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
            Stories, insights, and explorations of fragrance, craftsmanship, and
            the art of living with intention.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-4">
                Featured
              </p>
              <h2 className="text-4xl md:text-5xl font-light tracking-wider mb-6 leading-tight">
                {articles[0].title}
              </h2>
              <p className="text-gray-700 font-light leading-relaxed mb-6 text-lg">
                {articles[0].excerpt}
              </p>
              <p className="text-xs font-light text-gray-500 mb-8">
                {articles[0].date}
              </p>
              <Button variant="secondary">READ ARTICLE</Button>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={articles[0].image}
                alt={articles[0].title}
                className="w-full aspect-video object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-light tracking-wider mb-16">
            More Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {articles.slice(1).map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="overflow-hidden bg-gray-200 aspect-video mb-6">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                  {article.date}
                </p>
                <h3 className="text-xl font-light tracking-wide mb-3 group-hover:text-gray-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 font-light leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <button className="text-xs font-light tracking-widest uppercase text-gray-600 group-hover:text-black transition-colors">
                  READ MORE →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light tracking-wider mb-6">
            Subscribe to Our Journal
          </h2>
          <p className="text-gray-600 font-light mb-8 leading-relaxed">
            Receive our latest stories, fragrance insights, and exclusive
            announcements directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors"
            />
            <Button variant="primary">SUBSCRIBE</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
