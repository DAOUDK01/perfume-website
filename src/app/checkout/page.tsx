"use client";

import Button from "@/src/components/Button";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    setLoading(false);
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 15;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (loading) return <div className="pt-32">Loading...</div>;

  return (
    <div className="bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-20">
          <h1 className="text-5xl font-light tracking-wide font-serif mb-4">
            Checkout
          </h1>
          <p className="text-gray-600 font-light">
            Complete your order
          </p>
        </div>

        {/* Main Checkout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-16">
            {/* Customer Information */}
            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-full text-sm font-light">
                  1
                </div>
                <h2 className="text-2xl font-light tracking-wide font-serif">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-4 ml-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                />
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Shipping Address */}
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
                  placeholder="Street Address"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    className="px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Payment Information */}
            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-8 h-8 bg-gray-300 text-black flex items-center justify-center rounded-full text-sm font-light">
                  3
                </div>
                <h2 className="text-2xl font-light tracking-wide font-serif">
                  Payment Information
                </h2>
              </div>

              <div className="space-y-4 ml-12">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                  <p className="text-sm font-light text-gray-700">
                    ⚠️ Demo mode: No actual transactions will be processed.
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
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-40 h-fit">
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
                    <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <p className="font-light">{item.name}</p>
                        <p className="text-sm text-gray-600 font-light mb-2">
                          ${item.price} each
                        </p>
                        <div className="flex items-center gap-2 bg-white border border-gray-300 w-fit rounded">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-gray-100 text-sm"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-8 text-center text-sm border-l border-r border-gray-300 py-1 focus:outline-none"
                            min="1"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                          className="text-xs text-red-600 hover:text-red-700"
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

              {/* CTA */}
              <Button variant="primary" className="w-full mb-4">
                Complete Purchase
              </Button>
              <Button variant="secondary" className="w-full">
                Continue Shopping
              </Button>

              {/* Trust Elements */}
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3 text-xs font-light text-gray-600">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Secure SSL Encryption
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  30-Day Money Back Guarantee
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Free Shipping Over $100
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
