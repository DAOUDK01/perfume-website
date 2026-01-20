"use client";

import { fragrances as staticFragrances } from "@/src/data/fragrances";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type FragranceItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image?: string;
};

export default function FragrancesPage() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [list, setList] = useState<FragranceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "{}");
    setCart(savedCart);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        const staticIds = new Set(staticFragrances.map((f) => f.id));
        if (res.ok && Array.isArray(data.products)) {
          const fromApi = (data.products as FragranceItem[]).filter((p) => !staticIds.has(p.id));
          setList([...staticFragrances, ...fromApi]);
        } else {
          setList(staticFragrances);
        }
      } catch {
        if (cancelled) return;
        setList(staticFragrances);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const addToCart = useCallback((id: string) => {
    setCart((prev) => {
      const updated = { ...prev, [id]: (prev[id] || 0) + 1 };
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
              {list.map((fragrance) => (
                <FragranceCard
                  key={fragrance.id}
                  fragrance={fragrance}
                  inCart={cart[fragrance.id] || 0}
                  onAddToCart={() => addToCart(fragrance.id)}
                />
              ))}
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
    <article className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
      <Link href={`/product/${fragrance.id}`} className="flex flex-col flex-1">
        {/* IMAGE */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fragrance.image!}
              alt={fragrance.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200">
              <span className="text-5xl md:text-6xl font-serif font-light">
                {fragrance.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5 md:p-6 flex flex-1 flex-col text-center">
          <h3 className="text-lg md:text-xl font-serif font-light tracking-wide text-gray-900">
            {fragrance.name}
          </h3>
          <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2 font-light">
            {fragrance.tagline || "Eau de parfum"}
          </p>
          <div className="mt-4 flex flex-col items-center gap-3">
            <span className="text-sm font-medium text-gray-900">
              ${fragrance.price}
            </span>
            <button
              onClick={handleAdd}
              className="w-full max-w-[200px] py-2.5 px-4 text-[10px] md:text-xs tracking-[0.2em] uppercase border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              {inCart > 0 ? `In Bag (${inCart})` : "Add to Bag"}
            </button>
          </div>
        </div>
      </Link>

      {added && (
        <p className="pb-4 text-center text-xs text-gray-500 font-light">
          Added to bag
        </p>
      )}
    </article>
  );
}
