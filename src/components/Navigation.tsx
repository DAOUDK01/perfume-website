"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type SearchProduct = {
  id: string;
  name: string;
  tagline: string;
  image?: string;
  price: number;
};

function parseCart(value: string | null): CartItem[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item: any) => ({
        id: String(item.id ?? ""),
        name: String(item.name ?? "Item"),
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }))
      .filter((item) => item.id);
  } catch {
    return [];
  }
}

function isValidImageUrl(value?: string): boolean {
  return Boolean(
    value &&
    (value.startsWith("http") ||
      value.startsWith("/") ||
      value.startsWith("./")),
  );
}

export default function Navigation() {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAnimating, setIsMobileAnimating] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadCart = () => {
    setCartItems(parseCart(localStorage.getItem("cart")));
  };

  const closeMobileMenu = () => {
    setIsMobileAnimating(false);
    setTimeout(() => setIsMobileMenuOpen(false), 300);
  };

  const openMobileMenu = () => {
    if (isCartOpen) {
      closeCartDrawer();
    }

    setIsMobileMenuOpen(true);
    setTimeout(() => setIsMobileAnimating(true), 10);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  const closeCartDrawer = () => {
    setIsCartAnimating(false);
    setTimeout(() => setIsCartOpen(false), 300);
  };

  const openCartDrawer = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }

    loadCart();
    setIsCartOpen(true);
    setTimeout(() => setIsCartAnimating(true), 10);
  };

  const toggleCartDrawer = () => {
    if (isCartOpen) {
      closeCartDrawer();
    } else {
      openCartDrawer();
    }
  };

  const closeSearchModal = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const openSearchModal = () => {
    if (isCartOpen) {
      closeCartDrawer();
    }

    if (isMobileMenuOpen) {
      closeMobileMenu();
    }

    setIsSearchOpen(true);
  };

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const incrementQty = (id: string) => {
    updateCart(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decrementQty = (id: string) => {
    updateCart(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    updateCart(cartItems.filter((item) => item.id !== id));
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  useEffect(() => {
    loadCart();
  }, [pathname]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || event.key === "cart") {
        loadCart();
      }
    };

    const handleFocus = () => {
      loadCart();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      loadCart();
    }
  }, [isCartOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    const query = searchQuery.trim();
    if (!query) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    let cancelled = false;
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?q=${encodeURIComponent(query)}`,
          { cache: "no-store" },
        );
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        const products = Array.isArray(data.products)
          ? (data.products as Array<Record<string, unknown>>)
          : [];

        const mapped = products
          .map((item) => ({
            id: String(item.id ?? ""),
            name: String(item.name ?? ""),
            tagline: String(item.tagline ?? ""),
            image: typeof item.image === "string" ? item.image : undefined,
            price: Number(item.price) || 0,
          }))
          .filter((item) => item.id && item.name)
          .slice(0, 6);

        setSearchResults(mapped);
      } catch {
        if (cancelled) return;
        setSearchResults([]);
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isSearchOpen, searchQuery]);

  useEffect(() => {
    // Lock body scroll when either drawer is open/animating.
    if (isMobileAnimating || isCartAnimating || isSearchOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileAnimating, isCartAnimating, isSearchOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80  backdrop-blur-md border-b border-gray-100  transition-all duration-300 animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo — Agrandir Bold, no space */}
          <Link
            href="/"
            className="text-2xl font-agrandir font-bold tracking-tighter hover:opacity-80 transition-opacity duration-300 text-black "
            style={{ letterSpacing: "-0.04em" }}
          >
            e'eora
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-10 items-center text-sm font-medium tracking-wide">
            {[
              { name: "Home", href: "/" },
              { name: "Fragrances", href: "/fragrances" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative py-1 text-gray-600  hover:text-black  transition-colors duration-300 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-black  transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Icon & Search */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSearchModal}
              className="p-1 text-gray-600  hover:text-black  transition-colors duration-200"
              aria-label="Search fragrances"
            >
              <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <button
              onClick={toggleCartDrawer}
              className="relative p-1 text-gray-600  hover:text-black  transition-colors duration-200"
              aria-label="Open cart drawer"
            >
              <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[10px] font-medium flex items-center justify-center leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-600  hover:text-black  focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-[999] bg-black bg-opacity-50 md:hidden transition-opacity duration-300 ${
            isMobileAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white/90  backdrop-blur-md z-[1000] flex flex-col shadow-lg transform transition-transform duration-300 ease-out ${
            isMobileAnimating ? "translate-x-0" : "translate-x-full"
          } overflow-y-auto`} // Added overflow-y-auto for internal scrolling
        >
          <div className="flex justify-between items-center p-4">
            <span aria-hidden="true" className="h-6 w-6" />
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600  hover:text-black  focus:outline-none"
            >
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-grow space-y-8 pb-8">
            {[
              { name: "Home", href: "/" },
              { name: "Fragrances", href: "/fragrances" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-agrandir font-bold text-gray-800  hover:text-black  transition-colors duration-300"
                onClick={toggleMobileMenu} // Close menu on link click
              >
                {link.name}
              </Link>
            ))}
          </div>
          {/* Bottom branding */}
          <div className="p-4 text-center border-t border-gray-200 ">
            <Link
              href="/"
              className="text-2xl font-agrandir font-bold tracking-tighter hover:opacity-80 transition-opacity duration-300 text-black "
              style={{ letterSpacing: "-0.04em" }}
              onClick={toggleMobileMenu}
            >
              e'eora
            </Link>
          </div>
        </div>
      )}

      {/* Cart Overlay */}
      {isCartOpen && (
        <div
          className={`fixed inset-0 z-[1001] bg-black/40 transition-opacity duration-300 ${
            isCartAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeCartDrawer}
        />
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <aside
          className={`fixed inset-y-0 right-0 w-full max-w-md bg-white/95  backdrop-blur-md z-[1002] border-l border-gray-200  shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
            isCartAnimating ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Shopping cart"
        >
          <div className="px-5 py-4 border-b border-gray-200  flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500  font-medium">
                Shopping Bag
              </p>
              <h3 className="text-lg font-serif font-light text-gray-900 ">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </h3>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1 text-gray-600  hover:text-black  transition-colors"
              aria-label="Close cart drawer"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-gray-100  flex items-center justify-center mb-4">
                  <ShoppingBagIcon className="h-7 w-7 text-gray-500 " />
                </div>
                <p className="text-gray-700  font-light mb-2">
                  Your cart is empty
                </p>
                <p className="text-sm text-gray-500  font-light mb-6">
                  Add fragrances to review them here.
                </p>
                <Link
                  href="/fragrances"
                  onClick={closeCartDrawer}
                  className="px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors"
                >
                  Browse Fragrances
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {cartItems.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-gray-200  bg-gray-50/80  p-4"
                  >
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-xl border border-gray-200  bg-white  flex items-center justify-center text-sm font-serif text-gray-700  shrink-0">
                        {item.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-gray-900  truncate">
                            {item.name}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-gray-500  hover:text-black  transition-colors"
                          >
                            Remove
                          </button>
                        </div>

                        <p className="text-sm text-gray-600  mt-1">
                          Rs {item.price.toFixed(2)}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-gray-300  bg-white ">
                            <button
                              onClick={() => decrementQty(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600  hover:text-black  transition-colors"
                              aria-label={`Decrease quantity for ${item.name}`}
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center text-sm text-gray-900  font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQty(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-600  hover:text-black  transition-colors"
                              aria-label={`Increase quantity for ${item.name}`}
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <p className="text-sm font-semibold text-gray-900 ">
                            Rs {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-gray-200  p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 ">Subtotal</span>
              <span className="text-lg font-semibold text-gray-900 ">
                Rs {cartSubtotal.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeCartDrawer}
                className="py-3 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-colors"
              >
                Keep Browsing
              </button>
              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="py-3 rounded-full bg-gray-900 text-white text-sm font-medium text-center hover:bg-black transition-colors"
              >
                Checkout
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* Search Modal Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[1000] bg-black/30 transition-opacity duration-300"
          onClick={closeSearchModal}
        />
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center px-4 py-8">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between gap-4">
              <h3 className="text-lg font-serif font-light text-gray-900">
                Search Fragrances
              </h3>
              <button
                onClick={closeSearchModal}
                className="p-1 text-gray-500 hover:text-black transition-colors"
                aria-label="Close search"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative group">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      closeSearchModal();
                    }
                  }}
                  placeholder="Search by name or tagline..."
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900 placeholder:text-gray-400 transition-all duration-300"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto rounded-xl border border-gray-200 bg-white">
                {searchQuery.trim() === "" ? (
                  <p className="px-4 py-5 text-sm text-gray-500 font-light">
                    Start typing to see fragrance suggestions.
                  </p>
                ) : isSearching ? (
                  <p className="px-4 py-5 text-sm text-gray-500 font-light">
                    Searching...
                  </p>
                ) : searchResults.length === 0 ? (
                  <p className="px-4 py-5 text-sm text-gray-500 font-light">
                    No matching fragrance found.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/product/${product.id}`}
                          onClick={closeSearchModal}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative h-12 w-12 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0">
                            {isValidImageUrl(product.image) ? (
                              <Image
                                src={product.image!}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm font-serif">
                                {product.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {product.tagline || "Eau de parfum"}
                            </p>
                          </div>

                          <p className="text-xs font-semibold text-gray-800 shrink-0">
                            Rs {product.price.toFixed(2)}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={closeSearchModal}
                  className="py-3 rounded-full border border-gray-300 text-gray-700 font-medium text-sm hover:border-gray-900 hover:text-black transition-colors duration-300"
                >
                  Close
                </button>
                <Link
                  href={`/fragrances${searchQuery.trim() ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                  onClick={closeSearchModal}
                  className="py-3 rounded-full bg-gray-900 text-white font-medium text-sm hover:bg-black transition-colors duration-300 text-center"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
