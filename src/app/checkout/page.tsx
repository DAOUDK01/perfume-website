"use client";

import Button from "@/components/Button";
import ScrollReveal from "@/components/ScrollReveal";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type CartItem = {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: "full" | "tester";
  maxQuantity?: number;
};

const TESTER_MAX_QTY = 1;
const TESTER_PACK_SIZE = 5;
const TESTER_PACK_PRICE = 1500;

function isTesterItem(item: CartItem): boolean {
  return item.variant === "tester" || item.id.endsWith("::tester");
}

function extractTesterProductId(item: CartItem): string {
  if (item.productId) return item.productId;
  return item.id.replace(/::tester$/, "");
}

function sanitizeCartItems(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .filter((item) => item && typeof item === "object")
    .map((item: any) => {
      const variant: "full" | "tester" =
        item.variant === "tester" ? "tester" : "full";
      const maxQuantity = variant === "tester" ? TESTER_MAX_QTY : undefined;
      const quantity = Math.max(1, Number(item.quantity) || 1);

      return {
        id: String(item.id ?? ""),
        productId: String(item.productId ?? ""),
        name: String(item.name ?? "Item"),
        price: Number(item.price) || 0,
        quantity: maxQuantity ? Math.min(maxQuantity, quantity) : quantity,
        image: typeof item.image === "string" ? item.image : "",
        variant,
        maxQuantity,
      };
    })
    .filter((item) => item.id);
}

function isValidImageUrl(value?: string): boolean {
  return Boolean(
    value &&
    (value.startsWith("http") ||
      value.startsWith("/") ||
      value.startsWith("./")),
  );
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("cashOnDelivery");
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const emailRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300";

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(sanitizeCartItems(cart));
    } catch {
      setCartItems([]);
    } finally {
      setLoading(false);
      setTimeout(() => emailRef.current?.focus(), 400);
    }
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (id: string) => {
    updateCart(
      cartItems.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity: isTesterItem(i)
                ? Math.min(TESTER_MAX_QTY, i.quantity + 1)
                : i.quantity + 1,
            }
          : i,
      ),
    );
  };

  const decreaseQuantity = (id: string) => {
    updateCart(
      cartItems.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i,
      ),
    );
  };

  const removeItem = (id: string) => {
    updateCart(cartItems.filter((i) => i.id !== id));
  };

  const testerItems = cartItems.filter((item) => isTesterItem(item));
  const testerVariantCount = new Set(
    testerItems.map((item) => extractTesterProductId(item)),
  ).size;
  const hasTesterSelection = testerVariantCount > 0;
  const isTesterPackOnly =
    hasTesterSelection && testerItems.length === cartItems.length;
  const isTesterPackReady = testerVariantCount === TESTER_PACK_SIZE;
  const isValidTesterPackCheckout = !hasTesterSelection || isTesterPackReady;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const required = ["firstName", "email", "street", "city"];
    const newErrors: Record<string, string> = {};

    required.forEach((f) => {
      if (!form.get(f)) newErrors[f] = "Required";
    });

    if (!cartItems.length) newErrors.submit = "Your cart is empty";
    if (hasTesterSelection && !isTesterPackReady) {
      newErrors.submit = `Tester pack requires exactly ${TESTER_PACK_SIZE} different variants.`;
    }
    if (!hasAgreedToTerms)
      newErrors.terms = "Please agree to terms and policies";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.get("firstName")} ${form.get("lastName") || ""}`,
          email: form.get("email"),
          phone: form.get("phone"),
          address: `${form.get("street")}, ${form.get("city")}`,
          paymentMethod: selectedPaymentMethod,
          items: cartItems,
        }),
      });

      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));
      window.location.href = "/checkout/confirmation";
    } catch {
      setErrors({ submit: "Order failed. Please try again." });
      setIsSubmitting(false);
    }
  };

  const defaultSubtotal = cartItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0,
  );
  const subtotal =
    isTesterPackOnly && isTesterPackReady ? TESTER_PACK_PRICE : defaultSubtotal;
  const shipping = isTesterPackOnly && isTesterPackReady ? 0 : 250;
  const total = subtotal + shipping;
  const testerPackApplied = isTesterPackOnly && isTesterPackReady;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 ">
        <p className="text-gray-600 ">Loading checkout…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50  pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-serif text-center mb-4 text-gray-900 ">
            Checkout
          </h1>
          <p className="text-center text-gray-600  mb-12">
            Secure checkout • SSL protected
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white  rounded-2xl p-6 md:p-8 shadow border border-gray-100 "
          >
            {/* CONTACT */}
            <h2 className="text-2xl font-serif mb-6 text-gray-900 ">
              Contact Info
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First name *"
                className={inputClass}
              />
              <input
                name="lastName"
                placeholder="Last name"
                className={inputClass}
              />
            </div>

            <input
              ref={emailRef}
              name="email"
              type="email"
              placeholder="Email address *"
              className={`${inputClass} mt-4`}
            />

            <input
              name="phone"
              placeholder="Phone number"
              className={`${inputClass} mt-4`}
            />

            {/* ADDRESS */}
            <h2 className="text-2xl font-serif mt-10 mb-6 text-gray-900 ">
              Shipping Address
            </h2>

            <input
              name="street"
              placeholder="Street address *"
              className={inputClass}
            />

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input name="city" placeholder="City *" className={inputClass} />
              <input name="state" placeholder="State" className={inputClass} />
            </div>

            {/* PAYMENT */}
            <h2 className="text-2xl font-serif mt-10 mb-6 text-gray-900 ">
              Payment Method
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["cashOnDelivery", "💵 Cash on Delivery"],
                ["easyPaisa", "📱 EasyPaisa"],
                ["jazzCash", "🎵 JazzCash"],
                ["bankTransfer", "🏦 Bank Transfer"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`border rounded-2xl p-4 cursor-pointer transition ${
                    selectedPaymentMethod === value
                      ? "border-black  bg-gray-50 "
                      : "border-gray-200 "
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={selectedPaymentMethod === value}
                    onChange={() => setSelectedPaymentMethod(value)}
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* PAYMENT DETAILS */}
            {selectedPaymentMethod !== "cashOnDelivery" && (
              <div className="mt-6 p-5 rounded-2xl bg-gray-50  border border-gray-200 ">
                {selectedPaymentMethod === "easyPaisa" && (
                  <>
                    <h4 className="font-semibold mb-2">EasyPaisa Details</h4>
                    <p>
                      Account Name: <b>Daoud Khalid</b>
                    </p>
                    <p>
                      EasyPaisa Number: <b>+92 315 018825</b>
                    </p>
                    <p className="text-sm text-gray-600  mt-2">
                      Send payment and mention your order email in notes.
                    </p>
                  </>
                )}

                {selectedPaymentMethod === "jazzCash" && (
                  <>
                    <h4 className="font-semibold mb-2">JazzCash Details</h4>
                    <p>
                      Account Name: <b>Daoud Khalid</b>
                    </p>
                    <p>
                      JazzCash Number: <b>+92 315 018825</b>
                    </p>
                    <p className="text-sm text-gray-600  mt-2">
                      Send payment and mention your order email.
                    </p>
                  </>
                )}

                {selectedPaymentMethod === "bankTransfer" && (
                  <>
                    <h4 className="font-semibold mb-2">
                      Bank Transfer Details
                    </h4>
                    <p>
                      Bank Name: <b>Bank Al Habib</b>
                    </p>
                    <p>
                      Account Title: <b>Daoud Khalid</b>
                    </p>
                    <p>
                      IBAN: <b>PK69BAHL5541008100272501</b>
                    </p>
                    <p className="text-sm text-gray-600  mt-2">
                      Please transfer the exact amount and include your email as
                      reference.
                    </p>
                  </>
                )}
              </div>
            )}

            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={hasAgreedToTerms}
                  onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/policies"
                    className="font-medium text-gray-900 underline underline-offset-2"
                  >
                    Terms and Policies
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-600 text-sm mt-2">{errors.terms}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-600 mt-4">{errors.submit}</p>
            )}

            {hasTesterSelection && !isTesterPackReady && (
              <p className="text-amber-700 mt-4">
                Add exactly {TESTER_PACK_SIZE} tester variants to place this
                order.
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !isValidTesterPackCheckout}
              className="w-full mt-10 py-4 text-lg"
            >
              {isSubmitting
                ? "Processing…"
                : `Place Order — Rs ${total.toFixed(2)}`}
            </Button>
          </form>

          {/* SUMMARY */}
          <aside
            id="order-summary"
            className="bg-white  rounded-2xl p-6 shadow sticky top-28 h-fit border border-gray-100 "
          >
            <h3 className="text-2xl font-serif mb-6 text-gray-900 ">
              Order Summary
            </h3>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                      {isValidImageUrl(item.image) ? (
                        <Image
                          src={item.image!}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-100" />
                      )}
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {isTesterItem(item) && (
                        <p className="text-[11px] uppercase tracking-[0.14em] text-gray-500 mt-1">
                          Tester (1 per variant)
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-7 w-7 rounded-full border border-gray-300 inline-flex items-center justify-center hover:border-black transition-colors"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className={`h-7 w-7 rounded-full border inline-flex items-center justify-center transition-colors ${
                            isTesterItem(item) &&
                            item.quantity >= TESTER_MAX_QTY
                              ? "border-gray-200 text-gray-300 cursor-not-allowed"
                              : "border-gray-300 hover:border-black"
                          }`}
                          aria-label={`Increase quantity for ${item.name}`}
                          disabled={
                            isTesterItem(item) &&
                            item.quantity >= TESTER_MAX_QTY
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {testerPackApplied && isTesterItem(item)
                        ? "Included in tester pack"
                        : `Rs ${(item.price * item.quantity).toFixed(2)}`}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 space-y-2 text-sm">
              {testerPackApplied && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs uppercase tracking-[0.14em] text-gray-700">
                  Tester pack applied: {TESTER_PACK_SIZE} variants for Rs{" "}
                  {TESTER_PACK_PRICE} with free delivery
                </div>
              )}
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-3">
                <span>Total</span>
                <span>Rs {total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
