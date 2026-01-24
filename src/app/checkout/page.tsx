"use client";

import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("cashOnDelivery");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(Array.isArray(cart) ? cart : []);
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
  };

  const increaseQuantity = (id: string) => {
    updateCart(
      cartItems.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    updateCart(
      cartItems
        .map((i) =>
          i.id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    updateCart(cartItems.filter((i) => i.id !== id));
  };

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
      window.location.href = "/checkout/confirmation";
    } catch {
      setErrors({ submit: "Order failed. Please try again." });
      setIsSubmitting(false);
    }
  };

  const subtotal = cartItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  );
  const shipping = 15;
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = subtotal + shipping + tax;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading checkout…
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-serif text-center mb-4">
            Checkout
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Secure checkout • SSL protected
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow"
          >
            {/* CONTACT */}
            <h2 className="text-2xl font-serif mb-6">Contact Info</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <input name="firstName" placeholder="First name *" className="input" />
              <input name="lastName" placeholder="Last name" className="input" />
            </div>

            <input
              ref={emailRef}
              name="email"
              type="email"
              placeholder="Email address *"
              className="input mt-4"
            />

            <input name="phone" placeholder="Phone number" className="input mt-4" />

            {/* ADDRESS */}
            <h2 className="text-2xl font-serif mt-10 mb-6">Shipping Address</h2>

            <input name="street" placeholder="Street address *" className="input" />

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input name="city" placeholder="City *" className="input" />
              <input name="state" placeholder="State" className="input" />
            </div>

            {/* PAYMENT */}
            <h2 className="text-2xl font-serif mt-10 mb-6">Payment Method</h2>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["cashOnDelivery", "💵 Cash on Delivery"],
                ["easyPaisa", "📱 EasyPaisa"],
                ["jazzCash", "🎵 JazzCash"],
                ["bankTransfer", "🏦 Bank Transfer"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`border rounded-xl p-4 cursor-pointer transition ${
                    selectedPaymentMethod === value
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
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
              <div className="mt-6 p-5 rounded-xl bg-gray-50 border">
                {selectedPaymentMethod === "easyPaisa" && (
                  <>
                    <h4 className="font-semibold mb-2">EasyPaisa Details</h4>
                    <p>Account Name: <b>Daoud Khalid</b></p>
                    <p>EasyPaisa Number: <b>+92 315 018825</b></p>
                    <p className="text-sm text-gray-600 mt-2">
                      Send payment and mention your order email in notes.
                    </p>
                  </>
                )}

                {selectedPaymentMethod === "jazzCash" && (
                  <>
                    <h4 className="font-semibold mb-2">JazzCash Details</h4>
                    <p>Account Name: <b>Daoud Khalid</b></p>
                    <p>JazzCash Number: <b>+92 315 018825</b></p>
                    <p className="text-sm text-gray-600 mt-2">
                      Send payment and mention your order email.
                    </p>
                  </>
                )}

                {selectedPaymentMethod === "bankTransfer" && (
                  <>
                    <h4 className="font-semibold mb-2">Bank Transfer Details</h4>
                    <p>Bank Name: <b>Bank Al Habib</b></p>
                    <p>Account Title: <b>Daoud Khalid</b></p>
                    <p>IBAN: <b>PK69BAHL5541008100272501</b></p>
                    <p className="text-sm text-gray-600 mt-2">
                      Please transfer the exact amount and include your email as reference.
                    </p>
                  </>
                )}
              </div>
            )}

            {errors.submit && (
              <p className="text-red-600 mt-4">{errors.submit}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-10 py-4 text-lg"
            >
              {isSubmitting
                ? "Processing…"
                : `Place Order — $${total.toFixed(2)}`}
            </Button>
          </form>

          {/* SUMMARY */}
          <aside className="bg-white rounded-2xl p-6 shadow sticky top-28 h-fit">
            <h3 className="text-2xl font-serif mb-6">Order Summary</h3>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button type="button" onClick={() => decreaseQuantity(item.id)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => increaseQuantity(item.id)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 mt-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-3">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
