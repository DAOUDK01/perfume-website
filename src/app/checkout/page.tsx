"use client";

import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cashOnDelivery");
  const emailRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      
      if (Array.isArray(cart)) {
        setCartItems(cart);
      } else if (typeof cart === "object" && cart !== null) {
        console.log("Cart format migrated - please re-add items to cart");
        setCartItems([]);
        localStorage.setItem("cart", "[]");
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }
    setLoading(false);
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

  const increaseQuantity = (id: string) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item && (item.quantity || 0) > 1) {
      updateQuantity(id, (item.quantity || 0) - 1);
    } else {
      removeItem(id);
    }
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

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
      const fullName = `${firstName}${lastName ? " " + lastName : ""}`;
      const fullAddress = `${street}, ${city}, ${state} ${zipCode}`;

      const validCartItems = Array.isArray(cartItems) ? cartItems : [];
      if (validCartItems.length === 0) {
        setErrors({ submit: "Your cart is empty" });
        setIsSubmitting(false);
        return;
      }

      const orderData = {
        name: fullName,
        email,
        address: fullAddress,
        phone: formData.get("phone") as string,
        paymentMethod: selectedPaymentMethod,
        items: validCartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save order");
      }

      localStorage.setItem(
        "lastOrder",
        JSON.stringify({
          email,
          items: validCartItems,
          timestamp: new Date().toISOString(),
        })
      );
      localStorage.removeItem("cart");

      window.location.href = "/checkout/confirmation";
    } catch (error) {
      console.error("Order submission error:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Failed to save order",
      });
      setIsSubmitting(false);
    }
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const subtotal = safeCartItems.reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.quantity || 0),
    0
  );
  const shipping = 15;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + shipping + tax;

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-32">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-light tracking-wide font-serif mb-4 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent">
            Complete Your Purchase
          </h1>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Secure checkout. Your information is protected with SSL encryption.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
          {/* Main Form */}
          <div className="xl:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-8">
              
              {/* Stepper */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 border-4 border-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-900">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Contact Info</h3>
                    <p className="text-sm text-gray-500">Enter your details</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className="w-20 h-1 bg-gray-200 rounded-full" />
                  <span>Step 1 of 3</span>
                </div>
              </div>

              {/* Contact Information */}
              <section className="space-y-6">
                <h2 className="text-2xl font-light font-serif text-gray-900 mb-2">Your Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white ${
                        errors.firstName
                          ? "border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50"
                          : "border-gray-200 focus:border-gray-900 focus:ring-gray-100 hover:border-gray-300"
                      }`}
                      required
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100 hover:border-gray-300 transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white ${
                      errors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50"
                        : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 hover:border-gray-300"
                    }`}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">We'll only use this for order updates.</p>
                  {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+92315018825"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100 hover:border-gray-300 transition-all bg-white"
                  />
                </div>
              </section>

              <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

              {/* Cart Items Management */}
              <section className="space-y-6">
                <h2 className="text-2xl font-light font-serif text-gray-900 mb-2">Order Items</h2>
                {safeCartItems.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm text-gray-400 mt-1">Add items from the shop to continue</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {safeCartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-700">
                            {item.name.split(' ')[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg truncate">{item.name}</h4>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all flex-shrink-0"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          
                          <span className="w-12 text-center font-semibold text-gray-900 text-lg flex-shrink-0">
                            {item.quantity || 0}
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all flex-shrink-0"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-lg text-gray-900">
                            ${(item.price * (item.quantity || 0)).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all ml-2 flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

              {/* Shipping Address */}
              <section className="space-y-6">
                <h2 className="text-2xl font-light font-serif text-gray-900 mb-2">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      placeholder="House #12, Street 5"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white ${
                        errors.street
                          ? "border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50"
                          : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 hover:border-gray-300"
                      }`}
                      required
                    />
                    {errors.street && <p className="text-xs text-red-500 mt-1 font-medium">{errors.street}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Mansehra"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white ${
                          errors.city
                            ? "border-red-300 focus:border-red-400 focus:ring-red-200 bg-red-50"
                            : "border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 hover:border-gray-300"
                        }`}
                        required
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1 font-medium">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Khyber Pakhtunkhwa"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100 hover:border-gray-300 transition-all bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="22010"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100 hover:border-gray-300 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        name="country"
                        placeholder="Pakistan"
                        defaultValue="Pakistan"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100 hover:border-gray-300 transition-all bg-white"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </section>

              <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

              {/* Payment Method */}
              <section className="space-y-6">
                <h2 className="text-2xl font-light font-serif text-gray-900 mb-2">Payment Method</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cash on Delivery */}
                  <label className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all cursor-pointer group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cashOnDelivery"
                      checked={selectedPaymentMethod === "cashOnDelivery"}
                      onChange={() => setSelectedPaymentMethod("cashOnDelivery")}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all mt-0.5 ${
                        selectedPaymentMethod === "cashOnDelivery" 
                          ? "bg-green-500 border-green-500" 
                          : "border-gray-300 group-hover:border-gray-400"
                      }`}>
                        {selectedPaymentMethod === "cashOnDelivery" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">💰 Cash on Delivery</h4>
                        <p className="text-sm text-gray-600 mt-1">Pay cash when your order arrives</p>
                      </div>
                    </div>
                  </label>

                  {/* EasyPaisa */}
                  <label className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all cursor-pointer group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="easyPaisa"
                      checked={selectedPaymentMethod === "easyPaisa"}
                      onChange={() => setSelectedPaymentMethod("easyPaisa")}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all mt-0.5 ${
                        selectedPaymentMethod === "easyPaisa" 
                          ? "bg-orange-500 border-orange-500" 
                          : "border-gray-300 group-hover:border-gray-400"
                      }`}>
                        {selectedPaymentMethod === "easyPaisa" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">📱 EasyPaisa</h4>
                        <p className="text-sm text-gray-600 mt-1">+92315018825</p>
                      </div>
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all cursor-pointer group">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="jazzCash"
                      checked={selectedPaymentMethod === "jazzCash"}
                      onChange={() => setSelectedPaymentMethod("jazzCash")}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all mt-0.5 ${
                        selectedPaymentMethod === "jazzCash" 
                          ? "bg-purple-500 border-purple-500" 
                          : "border-gray-300 group-hover:border-gray-400"
                      }`}>
                        {selectedPaymentMethod === "jazzCash" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">🎵 JazzCash</h4>
                        <p className="text-sm text-gray-600 mt-1">+92315018825</p>
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 hover:shadow-md transition-all cursor-pointer group md:col-span-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bankTransfer"
                      checked={selectedPaymentMethod === "bankTransfer"}
                      onChange={() => setSelectedPaymentMethod("bankTransfer")}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-all mt-0.5 ${
                        selectedPaymentMethod === "bankTransfer" 
                          ? "bg-gray-800 border-gray-800" 
                          : "border-gray-300 group-hover:border-gray-400"
                      }`}>
                        {selectedPaymentMethod === "bankTransfer" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">🏦 Bank Transfer</h4>
                        <p className="text-sm text-gray-600 mt-1">Bank Al Habib • PK69BAHL5541008100272501</p>
                      </div>
                    </div>
                  </label>
                </div>
              </section>

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800 font-medium">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || safeCartItems.length === 0}
              >
                {isSubmitting ? "🔄 Processing Order..." : `🛒 Place Order - $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 xl:top-32 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 xl:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-light font-serif text-gray-900">Order Summary</h3>
                <span className="text-sm text-gray-500">{safeCartItems.length} items</span>
              </div>

              {safeCartItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {safeCartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                            <span className="text-sm font-medium">{item.name.split(' ')[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm truncate max-w-[120px]">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-semibold">${shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-3" />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 border-2 border-green-100 rounded-xl">
                    <p className="text-xs text-green-800 font-medium text-center">✅ Secure Checkout • SSL Protected</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
