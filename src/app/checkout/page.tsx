"use client";

import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import { useEffect, useRef, useState } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setLoading(false);

    // Auto-focus email after load
    setTimeout(() => emailRef.current?.focus(), 500);
  }, []);

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate fields
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zipCode = formData.get("zipCode") as string;

    if (!firstName) newErrors.firstName = "Please complete this field.";
    if (!email) newErrors.email = "Please complete this field.";
    if (!street) newErrors.street = "Please complete this field.";
    if (!city) newErrors.city = "Please complete this field.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Build full name and address
      const fullName = `${firstName}${lastName ? " " + lastName : ""}`;
      const fullAddress = `${street}, ${city}, ${state} ${zipCode}`;

      // Prepare order data
      const orderData = {
        name: fullName,
        email,
        address: fullAddress,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // Send to API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save order");
      }

      // Store order info and clear cart
      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          email,
          items: cartItems,
          timestamp: new Date().toISOString(),
        })
      );
      localStorage.removeItem("cart");

      // Redirect to confirmation
      window.location.href = "/checkout/confirmation";
    } catch (error) {
      console.error("Order submission error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to save order",
      });
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 15;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (loading) return <div className="pt-32">Loading...</div>;

  return (
    <div className="bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <ScrollReveal className="mb-20">
          <h1 className="text-5xl font-light tracking-wide font-serif mb-4">
            Complete Purchase
          </h1>
          <p className="text-gray-600 font-light">
            Secure checkout. All your information is safe.
          </p>
        </ScrollReveal>

        {/* Main Checkout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-16">
            {/* Customer Information */}
            <ScrollReveal>
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full text-sm font-light">
                    1
                  </div>
                  <h2 className="text-2xl font-light tracking-wide font-serif">
                    Your Information
                  </h2>
                </div>

                <div className="space-y-6 ml-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className={`w-full px-4 py-3 border transition-colors bg-white focus:outline-none ${
                          errors.firstName
                            ? "border-gray-300 focus:border-gray-400"
                            : "border-gray-300 focus:border-black"
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-gray-500 mt-2 font-light">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>

                  <div>
                    <input
                      ref={emailRef}
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className={`w-full px-4 py-3 border transition-colors bg-white focus:outline-none ${
                        errors.email
                          ? "border-gray-300 focus:border-gray-400"
                          : "border-gray-300 focus:border-black"
                      }`}
                    />
                    <p className="text-xs text-gray-500 mt-2 font-light">
                      We'll only use your email for order updates.
                    </p>
                    {errors.email && (
                      <p className="text-xs text-gray-500 mt-1 font-light">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />
                </div>
              </section>
            </ScrollReveal>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Shipping Address */}
            <ScrollReveal>
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-8 h-8 bg-gray-300 text-black flex items-center justify-center rounded-full text-sm font-light">
                    2
                  </div>
                  <h2 className="text-2xl font-light tracking-wide font-serif">
                    Shipping Address
                  </h2>
                </div>

                <div className="space-y-4 ml-12">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    className={`w-full px-4 py-3 border transition-colors bg-white focus:outline-none ${
                      errors.street
                        ? "border-gray-300 focus:border-gray-400"
                        : "border-gray-300 focus:border-black"
                    }`}
                  />
                  {errors.street && (
                    <p className="text-xs text-gray-500 mt-1 font-light">
                      {errors.street}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className={`w-full px-4 py-3 border transition-colors bg-white focus:outline-none ${
                          errors.city
                            ? "border-gray-300 focus:border-gray-400"
                            : "border-gray-300 focus:border-black"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-xs text-gray-500 mt-1 font-light">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Payment Information */}
            <ScrollReveal>
              <section>
                <div className="flex items-center gap-4 mb-12">
                  <div className="w-8 h-8 bg-gray-300 text-black flex items-center justify-center rounded-full text-sm font-light">
                    3
                  </div>
                  <h2 className="text-2xl font-light tracking-wide font-serif">
                    Payment
                  </h2>
                </div>

                <div className="space-y-4 ml-12">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                    <p className="text-sm font-light text-gray-600">
                      Demo mode: No actual transactions will be processed.
                    </p>
                  </div>

                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span className="text-sm font-light">
                      Billing address same as shipping
                    </span>
                  </label>
                </div>
              </section>
            </ScrollReveal>

            {/* Submit Button */}
            <ScrollReveal>
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
                  <p className="text-sm font-light text-red-700">
                    {errors.submit}
                  </p>
                </div>
              )}
              <Button
                variant="primary"
                className="w-full py-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Complete Purchase"}
              </Button>
            </ScrollReveal>
          </form>

          {/* Order Summary */}
          <ScrollReveal className="lg:sticky lg:top-40 h-fit">
            <div className="border border-gray-200 p-8 bg-gray-50">
              <h2 className="text-2xl font-light tracking-wide font-serif mb-8">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                {cartItems.length === 0 ? (
                  <p className="text-sm text-gray-600">Your cart is empty</p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-light">{item.name}</p>
                        <p className="text-sm text-gray-600 font-light mb-2">
                          ${item.price} each
                        </p>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 w-fit rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 hover:bg-gray-100 text-sm"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-8 text-center text-sm border-l border-r border-gray-300 py-1 focus:outline-none"
                            min="1"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 hover:bg-gray-100 text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-light text-sm mb-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm font-light">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-light">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-light">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between text-lg font-light">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Elements */}
              <div className="space-y-3 text-xs font-light text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>30-day returns</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Free shipping over $100</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
