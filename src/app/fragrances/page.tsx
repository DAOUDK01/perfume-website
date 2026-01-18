"use client";

import { fragrances } from "@/src/data/fragrances";
import { useState, useMemo } from "react";
import Link from "next/link";
import ScrollReveal from "@/src/components/ScrollReveal";
import { useRouter } from "next/navigation";

export default function FragrancesPage() {
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  
  // Memoized filtered fragrances for better performance
  const filteredFragrances = useMemo(() => {
    if (filter === "all") return fragrances;
    return fragrances.filter((f) => f.category === filter);
  }, [filter]);

  const handleContactUs = () => {
    router.push("/contact");
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <ScrollReveal className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-light mb-6 leading-tight">
            Our Collection
          </h1>
          <div className="w-24 h-px bg-gray-300 mx-auto mb-6" />
          <p className="text-lg sm:text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Browse our complete range of thoughtfully crafted fragrances. Each scent tells a unique story.
          </p>
        </ScrollReveal>
      </section>

      {/* Filter Section */}
      <section className="border-b border-gray-200 py-12 bg-white sticky top-16 z-20 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-light">
              <span>Showing</span>
              <span className="font-semibold text-gray-900">{filteredFragrances.length}</span>
              <span>of {fragrances.length} fragrances</span>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {["all", "fresh", "woody", "floral"].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-6 py-3 text-xs uppercase tracking-widest font-light border transition-all duration-300 rounded-full backdrop-blur-sm ${
                    filter === category
                      ? "bg-black text-white border-black shadow-lg shadow-black/10 hover:shadow-xl"
                      : "bg-white/80 text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-white hover:shadow-md"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredFragrances.length === 0 ? (
            <ScrollReveal className="text-center py-32">
              <div className="text-6xl font-serif font-light text-gray-200 mb-8">...</div>
              <h2 className="text-2xl font-serif font-light text-gray-600 mb-4">No fragrances found</h2>
              <p className="text-gray-500 mb-8">Try adjusting your filters above.</p>
              <button
                onClick={() => setFilter("all")}
                className="px-8 py-4 border-2 border-gray-300 hover:border-gray-500 bg-white hover:bg-gray-50 transition-all duration-300 text-sm font-light tracking-wide uppercase rounded-full"
              >
                Show All
              </button>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
              {filteredFragrances.map((fragrance, index) => (
                <ScrollReveal key={fragrance.id} delay={index * 50}>
                  <FragranceCard fragrance={fragrance} index={index} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 py-20 sm:py-32 bg-gradient-to-b from-gray-50 to-white">
        <ScrollReveal className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light mb-6 leading-tight">
            Can't decide?
          </h2>
          <p className="text-gray-600 font-light mb-12 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            Explore our curated sample sets or contact us for personalized recommendations.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/sample-sets" 
              className="px-8 py-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase rounded-full shadow-lg hover:shadow-xl"
            >
              Sample Sets
            </Link>
            <button
              onClick={handleContactUs}
              className="px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all duration-300 text-sm font-light tracking-wide uppercase rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              Contact Us
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}

interface FragranceCardProps {
  fragrance: {
    id: string;
    name: string;
    tagline: string;
    price: number;
    image: string;
    category?: string; // Added for filtering
  };
  index: number;
}

function FragranceCard({ fragrance, index }: FragranceCardProps) {
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === fragrance.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...fragrance, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2500);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === fragrance.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...fragrance, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    router.push("/checkout");
  };

  const isValidImageUrl = (image: string) => {
    return image && (image.startsWith('http') || image.startsWith('/') || image.startsWith('./'));
  };

  return (
    <div className="group relative">
      <Link href={`/product/${fragrance.id}`} className="block">
        {/* IMAGE CONTAINER */}
        <div className="relative w-full h-96 sm:h-[450px] mb-6 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group-hover:shadow-2xl transition-all duration-500">
          {isValidImageUrl(fragrance.image) && !imageError ? (
            <>
              <img
                src={fragrance.image}
                alt={fragrance.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={() => setImageError(true)}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300 transition-all duration-500">
              <div className="text-7xl sm:text-8xl font-serif font-light text-gray-300 mb-4 group-hover:text-gray-400 transition-all duration-300">
                {fragrance.name.charAt(0).toUpperCase()}
              </div>
              <div className="w-20 h-px bg-gray-300 mb-4" />
              <p className="text-xs tracking-widest text-gray-400 font-light uppercase">
                EAU DE PARFUM
              </p>
            </div>
          )}

          {/* Quick Actions - Show on hover */}
          <div className="absolute bottom-6 left-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-4 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-white/90 backdrop-blur-sm hover:bg-white text-black py-3.5 text-xs font-light tracking-wide uppercase border border-gray-300 hover:border-gray-400 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Add to Cart
            </button>
            <button
              onClick={handleQuickBuy}
              className="flex-1 bg-black hover:bg-gray-900 text-white py-3.5 text-xs font-light tracking-wide uppercase transition-all duration-300 rounded-xl shadow-2xl hover:shadow-black/20 hover:scale-[1.02]"
            >
              Quick Buy
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-light group-hover:text-black transition-all duration-300 mb-2 line-clamp-1">
              {fragrance.name}
            </h3>
            <p className="text-xs tracking-widest text-gray-500 font-light uppercase">
              Eau de Parfum
            </p>
          </div>
          
          <p className="text-sm text-gray-600 font-light leading-relaxed line-clamp-2 group-hover:line-clamp-none">
            {fragrance.tagline}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-2xl font-light group-hover:text-black transition-colors">${fragrance.price}</span>
            <span className="text-xs text-gray-400 font-light tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              VIEW DETAILS →
            </span>
          </div>
        </div>
      </Link>

      {/* Success Message */}
      {showMessage && (
        <div className="fixed top-24 right-6 bg-white/95 backdrop-blur-sm border border-green-200 shadow-2xl px-6 py-4 text-sm rounded-2xl z-50 animate-in slide-in-from-right duration-300 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="text-green-500 text-xl font-bold mt-0.5 flex-shrink-0">✓</div>
            <div>
              <p className="font-medium text-gray-900">Added to cart</p>
              <p className="text-xs text-gray-600 font-light truncate">{fragrance.name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
