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
    <main className="min-h-screen w-full bg-[#fafafa] overflow-visible">
      {/* HERO */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 text-center px-6 border-b border-gray-100">
        <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-gray-400 font-medium">
          Collection
        </span>
        <h1 className="mt-4 md:mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900">
          Fragrances
        </h1>
        <p className="mt-6 md:mt-8 max-w-lg mx-auto text-gray-500 text-base md:text-lg leading-relaxed font-light">
          A curated selection of timeless scents — refined, balanced, and composed with intention.
        </p>
      </section>

      {/* GRID */}
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fragrances by name or tagline..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="aspect-[4/5] bg-gray-100" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-50 rounded w-full" />
                    <div className="h-4 bg-gray-50 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500 font-light">No fragrances yet. Add some from the admin.</p>
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
    <article className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-2">
      <Link href={`/product/${fragrance.id}`} className="flex flex-col flex-1 relative">
        {/* IMAGE */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fragrance.image!}
              alt={fragrance.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200 bg-gray-50">
              <span className="text-5xl md:text-6xl font-serif font-light">
                {fragrance.name.charAt(0)}
              </span>
            </div>
          )}
          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center bg-gradient-to-t from-black/20 to-transparent">
             {/* Optional: Add quick view icon or similar here if desired */}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 md:p-6 flex flex-1 flex-col text-center">
          <h3 className="text-lg md:text-xl font-serif font-light tracking-wide text-gray-900 group-hover:text-black transition-colors">
            {fragrance.name}
          </h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-2 font-light">
            {fragrance.tagline || "Eau de parfum"}
          </p>
          <div className="mt-6 flex flex-col items-center gap-4">
            <span className="text-base font-medium text-gray-900">
              Rs {fragrance.price}
            </span>
            <button
              onClick={handleAdd}
              className={`w-full max-w-[220px] py-3 px-6 text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-300 ${
                inCart > 0 
                  ? "bg-black text-white shadow-md" 
                  : "bg-white text-black border border-gray-200 hover:border-black hover:bg-black hover:text-white"
              }`}
            >
              {inCart > 0 ? `In Bag (${inCart})` : "Add to Bag"}
            </button>
          </div>
        </div>
      </Link>

      {/* Added Notification */}
      <div className={`absolute top-4 right-4 bg-black text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg transform transition-all duration-300 ${added ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"}`}>
        Added
      </div>
    </article>
  );
}
