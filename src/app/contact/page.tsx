"use client";

import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import { useState, useRef } from "react";
import { Mail, Phone, Instagram, Twitter, Clock, MapPin } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name) newErrors.name = "Please complete this field.";
    if (!email) newErrors.email = "Please complete this field.";
    if (!message) newErrors.message = "Please complete this field.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      window.location.href = "/contact/confirmation";
    } catch (error) {
      console.error("Error sending message:", error);
      setErrors({ form: "Failed to send message. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fafafa] pt-32 pb-20">
      {/* Page Header */}
      <section className="relative py-20 mb-20 bg-white border-b border-gray-100 overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gray-50 via-white to-white opacity-60" />
        <ScrollReveal className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-gray-400 font-medium mb-4 block">
            Contact Us
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6 font-serif text-gray-900">
            Get In Touch
          </h1>
          <p className="text-gray-500 font-light text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We&apos;d love to hear from you. Questions about our fragrances? Feedback on your experience? We are here to help.
          </p>
        </ScrollReveal>
      </section>

      {/* Contact Content */}
      <section>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Form */}
            <ScrollReveal className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
              <div>
                <h2 className="text-3xl font-light tracking-tight mb-2 font-serif">
                  Send a message
                </h2>
                <p className="text-gray-500 font-light mb-10">We usually respond within 24 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name */}
                  <div className="group">
                    <label className="block text-xs font-medium tracking-widest uppercase text-gray-500 mb-2 group-focus-within:text-black transition-colors">
                      Full Name
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      name="name"
                      className={`w-full px-4 py-3 bg-gray-50 border-b-2 border-transparent focus:border-black transition-all duration-300 focus:bg-white outline-none ${
                        errors.name
                          ? "bg-red-50 border-red-300"
                          : "hover:bg-gray-100"
                      }`}
                      placeholder="e.g. Jane Doe"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-2 font-light">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-xs font-medium tracking-widest uppercase text-gray-500 mb-2 group-focus-within:text-black transition-colors">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={`w-full px-4 py-3 bg-gray-50 border-b-2 border-transparent focus:border-black transition-all duration-300 focus:bg-white outline-none ${
                        errors.email
                          ? "bg-red-50 border-red-300"
                          : "hover:bg-gray-100"
                      }`}
                      placeholder="e.g. jane@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 font-light">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="group">
                    <label className="block text-xs font-medium tracking-widest uppercase text-gray-500 mb-2 group-focus-within:text-black transition-colors">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      className={`w-full px-4 py-3 bg-gray-50 border-b-2 border-transparent focus:border-black transition-all duration-300 focus:bg-white outline-none resize-none ${
                        errors.message
                          ? "bg-red-50 border-red-300"
                          : "hover:bg-gray-100"
                      }`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-2 font-light">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-4 text-sm tracking-widest uppercase"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal delay={100} className="space-y-12 lg:pt-12">
              <div>
                <h2 className="text-3xl font-light tracking-tight mb-8 font-serif">
                  Connect with us
                </h2>

                <div className="grid gap-8">
                  {/* Email */}
                  <div className="flex items-start gap-5 p-6 rounded-xl hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:hello@eeora.com"
                        className="text-lg font-light text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        hello@eeora.com
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-5 p-6 rounded-xl hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
                        Phone
                      </p>
                      <a
                        href="tel:+923105018825"
                        className="text-lg font-light text-gray-900 hover:text-gray-600 transition-colors"
                      >
                        +92 310 5018825
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-5 p-6 rounded-xl hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors duration-300">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
                        Hours
                      </p>
                      <div className="space-y-1 text-gray-600 font-light">
                        <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                        <p>Sat - Sun: 10:00 AM - 4:00 PM</p>
                        <p className="text-xs text-gray-400 mt-1">(EST)</p>
                      </div>
                    </div>
                  </div>

                  {/* Social */}
                  <div className="flex items-start gap-5 p-6 rounded-xl hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 group">
                     <div className="p-3 bg-gray-100 rounded-full group-hover:bg-black group-hover:text-white transition-colors duration-300">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">
                        Social Media
                      </p>
                      <div className="flex gap-6">
                        <a
                          href="#instagram"
                          className="text-base font-light hover:underline underline-offset-4 decoration-gray-300 transition-all"
                        >
                          Instagram
                        </a>
                        <a
                          href="#twitter"
                          className="text-base font-light hover:underline underline-offset-4 decoration-gray-300 transition-all"
                        >
                          Twitter
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* White space */}
      <div className="h-12" />
    </div>
  );
}
