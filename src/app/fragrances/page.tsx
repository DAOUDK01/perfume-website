"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

type FragranceItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image?: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function FragrancesPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [list, setList] = useState<FragranceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      // Ensure cart is always an array
      if (Array.isArray(savedCart)) {
        setCart(savedCart);
      } else {
        // Old object format - clear it and start fresh
        setCart([]);
        localStorage.setItem("cart", "[]");
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const url = new URL("/api/products", window.location.origin);
        if (debouncedSearchQuery) {
          url.searchParams.set("q", debouncedSearchQuery);
        }
        const res = await fetch(url.toString(), { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (res.ok && Array.isArray(data.products)) {
          setList(data.products as FragranceItem[]);
        } else {
          setList([]);
        }
      } catch {
        if (cancelled) return;
        setList([]);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [debouncedSearchQuery]);

  const addToCart = useCallback((fragrance: FragranceItem) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === fragrance.id);
      let updated: CartItem[];
      
      if (existingItem) {
        updated = prev.map((item) =>
          item.id === fragrance.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [
          ...prev,
          {
            id: fragrance.id,
            name: fragrance.name,
            price: fragrance.price,
            quantity: 1,
          },
        ];
      }
      
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#fafafa] via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-visible">
      {/* HERO */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 text-center px-6 border-b border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-rose-200 to-pink-200 dark:from-rose-900 dark:to-pink-900 rounded-full blur-3xl animate-pulse" style={{animationDelay: '0s'}} />
          <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
        
        <div className="relative z-10">
          <span className="inline-block text-[10px] md:text-xs tracking-[0.35em] uppercase text-gray-400 dark:text-gray-500 font-medium animate-fade-in-up opacity-0" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
            Collection
          </span>
          <h1 className="mt-4 md:mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900 dark:text-gray-100 animate-fade-in-up opacity-0" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
            Fragrances
          </h1>
          <p className="mt-6 md:mt-8 max-w-lg mx-auto text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed font-light animate-fade-in-up opacity-0" style={{animationDelay: '0.6s', animationFillMode: 'forwards'}}>
            A curated selection of timeless scents — refined, balanced, and composed with intention.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative mb-12 animate-fade-in-up opacity-0" style={{animationDelay: '0.8s', animationFillMode: 'forwards'}}>
            <div className="relative group max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 transition-all duration-300 group-focus-within:text-black dark:group-focus-within:text-white group-focus-within:scale-110" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fragrances by name or tagline..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-black dark:focus:border-white bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-700" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-50 dark:bg-gray-600 rounded w-full" />
                    <div className="h-4 bg-gray-50 dark:bg-gray-600 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500 dark:text-gray-400 font-light">No fragrances yet. Add some from the admin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {list.map((fragrance) => {
                const cartItem = cart.find((item) => item.id === fragrance.id);
                return (
                  <FragranceCard
                    key={fragrance.id}
                    fragrance={fragrance}
                    inCart={cartItem?.quantity || 0}
                    onAddToCart={() => addToCart(fragrance)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/* CARD COMPONENT */
/* ------------------------------------------------------------------ */

interface FragranceCardProps {
  fragrance: FragranceItem;
  inCart: number;
  onAddToCart: () => void;
}

const isValidImageUrl = (url: string | undefined) =>
  url && (url.startsWith("http") || url.startsWith("/"));

function FragranceCard({
  fragrance,
  inCart,
  onAddToCart,
}: FragranceCardProps) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const showImage = isValidImageUrl(fragrance.image) && !imgError;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group flex flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-3xl hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-700 ease-out hover:-translate-y-3 hover:rotate-1 hover:scale-[1.02] animate-fade-in-up opacity-0" style={{animationFillMode: 'forwards'}}>
      <Link href={`/product/${fragrance.id}`} className="flex flex-col flex-1 relative overflow-hidden">
        {/* IMAGE */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          {showImage ? (
            <>
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fragrance.image!}
                alt={fragrance.name}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-3"
                onError={() => setImgError(true)}
              />
              {/* Image overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200 dark:text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
              <div className="relative">
                <span className="text-5xl md:text-6xl font-serif font-light transition-transform duration-500 group-hover:scale-110">
                  {fragrance.name.charAt(0)}
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-200/30 to-amber-200/30 dark:from-rose-800/30 dark:to-amber-800/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          )}
          {/* Enhanced Quick Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent">
            <div className="flex justify-center space-x-3">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
                <svg className="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 md:p-6 flex flex-1 flex-col text-center relative">
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50/30 to-transparent dark:from-gray-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
          
          <div className="relative z-10">
            <h3 className="text-lg md:text-xl font-serif font-light tracking-wide text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-all duration-300 group-hover:scale-105">
              {fragrance.name}
            </h3>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 font-light transition-colors duration-300 group-hover:text-gray-600 dark:group-hover:text-gray-300">
              {fragrance.tagline || "Eau de parfum"}
            </p>
            <div className="mt-6 flex flex-col items-center gap-5">
              <div className="relative">
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-all duration-300 group-hover:scale-110">
                  Rs {fragrance.price}
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-rose-100 to-amber-100 dark:from-rose-900/30 dark:to-amber-900/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
              <button
                onClick={handleAdd}
                className={`group/btn relative w-full max-w-[220px] py-3 px-6 text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
                  inCart > 0 
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-lg hover:shadow-xl" 
                    : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-black dark:text-white border border-gray-200 dark:border-gray-600 hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black shadow-sm hover:shadow-lg"
                }`}
              >
                <span className="relative z-10">
                  {inCart > 0 ? `In Bag (${inCart})` : "Add to Bag"}
                </span>
                {!inCart && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left" />
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Enhanced Added Notification */}
      <div className={`absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transform transition-all duration-500 flex items-center gap-2 ${added ? "translate-y-0 opacity-100 scale-100" : "-translate-y-8 opacity-0 scale-75 pointer-events-none"}`}>
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Added
      </div>
    </article>
  );
}
