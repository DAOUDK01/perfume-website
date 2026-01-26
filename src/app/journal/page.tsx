"use client";

import Button from "@/components/Button";
import { useState } from "react";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
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
    category: "Techniques",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Understanding Fragrance Notes",
    excerpt:
      "A deep dive into the poetry of perfumery. Learn how top, heart, and base notes create a symphony of scent that evolves over time.",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=400&fit=crop",
    date: "January 5, 2024",
    category: "Education",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "Sourcing Luxury: Our Ingredient Journey",
    excerpt:
      "Behind every bottle is a story of craftsmanship. Explore where our most precious ingredients come from and why quality matters.",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=400&fit=crop",
    date: "December 28, 2023",
    category: "Behind the Scenes",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Seasonal Scents: Fragrance for Every Season",
    excerpt:
      "How to select fragrances that complement the seasons. From fresh florals in spring to warm woods in winter.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    date: "December 20, 2023",
    category: "Guide",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "The Olfactory Memory",
    excerpt:
      "Why certain scents trigger vivid memories. Explore the profound connection between fragrance and the human mind.",
    image:
      "https://images.unsplash.com/photo-1595955707802-6b2ecef7cc14?w=600&h=400&fit=crop",
    date: "December 15, 2023",
    category: "Science",
    readTime: "8 min read",
  },
  {
    id: 6,
    title: "Fragrance Longevity: Making Your Scent Last",
    excerpt:
      "Expert tips on how to maximize the longevity of your fragrance. Learn the science behind scent projection and wear.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
    date: "December 8, 2023",
    category: "Tips",
    readTime: "5 min read",
  },
];

export default function JournalPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categories = ["all", "education", "techniques", "guide", "science", "tips"];

  const filteredArticles = selectedCategory === "all" 
    ? articles 
    : articles.filter(article => article.category.toLowerCase() === selectedCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-transparent to-gray-50 opacity-50" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
          <div className="mb-8">
            <span className="text-xs tracking-widest text-gray-500 font-agrandir uppercase">
              e'eora
            </span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif font-light mb-8 tracking-tight">
            Journal
          </h1>
          
          <div className="w-24 h-px bg-gray-300 mx-auto mb-8" />
          
          <p className="text-lg sm:text-xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
            Stories, insights, and explorations of fragrance, craftsmanship, and the art of living with intention.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-gray-200 py-6 bg-white sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 text-xs uppercase tracking-widest font-light border rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 sm:py-24 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <span className="inline-block px-4 py-1 bg-black text-white text-xs tracking-widest font-light uppercase">
              Featured
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <div className="flex items-center gap-4 text-xs text-gray-500 font-light">
                <span>{articles[0].date}</span>
                <span>•</span>
                <span>{articles[0].readTime}</span>
                <span>•</span>
                <span className="px-3 py-1 border border-gray-300 rounded-full">
                  {articles[0].category}
                </span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light leading-tight">
                {articles[0].title}
              </h2>
              
              <p className="text-lg text-gray-700 font-light leading-relaxed">
                {articles[0].excerpt}
              </p>
              
              <button className="inline-flex items-center gap-2 text-sm font-light border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all uppercase tracking-wide">
                Read Full Article
                <span>→</span>
              </button>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-lg group aspect-[4/3]">
                <Image
                  src={articles[0].image}
                  alt={articles[0].title}
                  fill
                  objectFit="cover"
                  className="group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-serif font-light mb-6">
              Latest Stories
            </h2>
            <div className="w-20 h-px bg-gray-300 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {filteredArticles.slice(1).map((article, index) => (
              <ArticleCard key={article.id} article={article} delay={index * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-8">
            <div className="inline-block border border-gray-300 rounded-full px-6 py-2 mb-6">
              <span className="text-xs tracking-widest text-gray-600 font-light uppercase">
                Stay Connected
              </span>
            </div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-serif font-light mb-6">
            Subscribe to Our Journal
          </h2>
          
          <div className="w-20 h-px bg-gray-300 mx-auto mb-8" />
          
          <p className="text-gray-600 font-light mb-10 leading-relaxed text-lg">
            Receive our latest stories, fragrance insights, and exclusive announcements directly in your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 border border-gray-300 focus:outline-none focus:border-black transition-colors font-light rounded"
            />
            <Button variant="primary">Subscribe</Button>
          </div>
          
          <p className="text-xs text-gray-500 font-light mt-6">
            Join 10,000+ readers who trust e&apos;eora
          </p>
        </div>
      </section>
    </div>
  );
}

// Article Card Component
function ArticleCard({ article, delay }: { article: Article; delay: number }) {
  return (
    <div 
      className="group cursor-pointer hover:-translate-y-2 transition-transform duration-500"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden rounded-xl mb-6 bg-gray-50 shadow-sm group-hover:shadow-xl transition-shadow duration-500 aspect-[4/3]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          objectFit="cover"
          className="group-hover:scale-110 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs tracking-wider font-light uppercase rounded-full border border-gray-100 shadow-sm">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="space-y-4 px-2">
        <div className="flex items-center gap-3 text-xs text-gray-400 font-light tracking-wide uppercase">
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        
        <h3 className="text-2xl font-serif font-light group-hover:text-gray-600 transition-colors leading-tight">
          {article.title}
        </h3>
        
        <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
        
        <button className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-gray-900 group-hover:text-gray-600 transition-colors pt-2 border-b border-transparent group-hover:border-gray-200 pb-0.5">
          Read More
          <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
        </button>
      </div>
    </div>
  );
}