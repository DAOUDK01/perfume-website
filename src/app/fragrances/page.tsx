"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
  category?: string;
};

type CategoryFilter = "all" | "men" | "woman" | "uni";

const categoryOptions: Array<{ value: CategoryFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "men", label: "Men" },
  { value: "woman", label: "Woman" },
  { value: "uni", label: "Unisex" },
];

function normalizeCategory(value?: string): CategoryFilter | null {
  const category = (value || "").toLowerCase().trim();

  if (!category) return null;
  if (category.includes("uni")) return "uni";
  if (
    category.includes("women") ||
    category.includes("woman") ||
    category.includes("female") ||
    category.includes("lady")
  ) {
    return "woman";
  }
  if (
    category.includes("men") ||
    category.includes("male") ||
    category.includes("man")
  ) {
    return "men";
  }

  return null;
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function FragrancesPage() {
  return (
    <Suspense fallback={<FragrancesLoading />}>
      <FragrancesContent />
    </Suspense>
  );
}

function FragrancesLoading() {
  return (
    <main className="min-h-screen w-full bg-[#fafafa] overflow-visible">
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 text-center px-6 border-b border-gray-100  overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block text-[10px] md:text-xs tracking-[0.35em] uppercase text-gray-400  font-medium animate-pulse">
            Collection
          </span>
          <h1 className="mt-4 md:mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900  animate-pulse">
            Fragrances
          </h1>
        </div>
      </section>
    </main>
  );
}

function FragrancesContent() {
  const searchParams = useSearchParams();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [list, setList] = useState<FragranceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const filteredList = list.filter((item) => {
    if (selectedCategory === "all") return true;
    return normalizeCategory(item.category) === selectedCategory;
  });

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
    return () => {
      cancelled = true;
    };
  }, [debouncedSearchQuery]);

  const addToCart = useCallback((fragrance: FragranceItem) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === fragrance.id);
      let updated: CartItem[];

      if (existingItem) {
        updated = prev.map((item) =>
          item.id === fragrance.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
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
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 text-center px-6 border-b border-gray-100  overflow-hidden">
        <div className="relative z-10">
          <span
            className="inline-block text-[10px] md:text-xs tracking-[0.35em] uppercase text-gray-400  font-medium animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Collection
          </span>
          <h1
            className="mt-4 md:mt-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900  animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            Fragrances
          </h1>
          <p
            className="mt-6 md:mt-8 max-w-lg mx-auto text-gray-500  text-base md:text-lg leading-relaxed font-light animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            A curated selection of timeless scents — refined, balanced, and
            composed with intention.
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="py-12 md:py-20 lg:py-28 px-4 sm:px-6">
        <div className="w-full max-w-7xl mx-auto">
          <div
            className="relative mb-8 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {categoryOptions.map((option) => {
                const isActive = selectedCategory === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedCategory(option.value)}
                    className={`rounded-full border px-4 py-2 text-xs sm:text-sm tracking-wide transition-all duration-300 ${
                      isActive
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 items-stretch sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white  rounded-2xl border border-gray-100  overflow-hidden"
                >
                  <div className="aspect-[4/5] bg-gray-100 " />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-100  rounded w-3/4" />
                    <div className="h-3 bg-gray-50  rounded w-full" />
                    <div className="h-4 bg-gray-50  rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-500  font-light">
                {list.length === 0
                  ? "No fragrances yet. Add some from the admin."
                  : "No fragrances found for this category."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-stretch sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredList.map((fragrance) => {
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

function FragranceCard({ fragrance, inCart, onAddToCart }: FragranceCardProps) {
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
    <article className="group flex h-full flex-col bg-white/90  backdrop-blur-sm rounded-2xl border border-gray-100  overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <Link
        href={`/product/${fragrance.id}`}
        className="flex flex-col flex-1 relative overflow-hidden"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100  ">
          {showImage ? (
            <>
              <Image
                src={fragrance.image!}
                alt={fragrance.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                onError={() => setImgError(true)}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-200  bg-gradient-to-br from-gray-50 to-gray-100  ">
              <div className="relative">
                <span className="text-5xl md:text-6xl font-serif font-light transition-transform duration-300 group-hover:scale-105">
                  {fragrance.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5 md:p-6 flex flex-1 flex-col text-center relative">
          <div className="relative z-10 flex h-full flex-col">
            <h3 className="text-xl md:text-2xl font-serif font-semibold tracking-wide text-gray-900  transition-colors duration-300">
              {fragrance.name}
            </h3>
            <p className="mt-3 text-sm text-gray-500  leading-relaxed line-clamp-2 font-light">
              {fragrance.tagline || "Eau de parfum"}
            </p>
            <div className="mt-auto pt-4 flex flex-col items-center gap-3">
              <div className="relative">
                <span className="text-base font-semibold text-gray-900 ">
                  Rs {fragrance.price}
                </span>
              </div>
              <button
                onClick={handleAdd}
                className={`w-full max-w-[180px] py-2 px-5 text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-300 ${
                  inCart > 0
                    ? "bg-black  text-white  shadow-lg"
                    : "bg-white/90  backdrop-blur-sm text-black  border border-gray-200  hover:border-black  hover:bg-black  hover:text-white  shadow-sm"
                }`}
              >
                {inCart > 0 ? `In Bag (${inCart})` : "Add to Bag"}
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Enhanced Added Notification */}
      <div
        className={`absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[10px] uppercase tracking-widest px-4 py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20 transform transition-all duration-500 flex items-center gap-2 ${added ? "translate-y-0 opacity-100 scale-100" : "-translate-y-8 opacity-0 scale-75 pointer-events-none"}`}
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Added
      </div>
    </article>
  );
}
