"use client";

import Button from "@/src/components/Button";
import ScrollReveal from "@/src/components/ScrollReveal";
import { useState, useRef } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
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

    // Simulate form submission
    setTimeout(() => {
      localStorage.setItem(
        "lastContact",
        JSON.stringify({
          name,
          email,
          message,
          timestamp: new Date().toISOString(),
        })
      );
      window.location.href = "/contact/confirmation";
    }, 1500);
  };

  return (
    <div className="bg-white pt-32 pb-20">
      {/* Page Header */}
      <section className="border-b border-gray-100 py-16 mb-24">
        <ScrollReveal className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4 font-serif">
            Get In Touch
          </h1>
          <p className="text-gray-600 font-light text-lg max-w-2xl mx-auto">
            We&apos;d love to hear from you. Questions? Feedback? Send us a message.
          </p>
        </ScrollReveal>
      </section>

      {/* Contact Content */}
      <section>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {/* Contact Form */}
            <ScrollReveal>
              <div>
                <h2 className="text-3xl font-light tracking-wider mb-12 font-serif">
                  Send us a message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                      Full Name
                    </label>
                    <input
                      ref={nameRef}
                      type="text"
                      name="name"
                      className={`w-full px-4 py-3 border transition-colors bg-white focus:outline-none ${
                        errors.name
                          ? "border-gray-300 focus:border-gray-400"
                          : "border-gray-300 focus:border-black"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-xs text-gray-500 mt-2 font-light">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={`w-full px-4 py-3 border transition-colors bg-white focus:outline-none ${
                        errors.email
                          ? "border-gray-300 focus:border-gray-400"
                          : "border-gray-300 focus:border-black"
                      }`}
                      placeholder="your@email.com"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-light">
                      We&apos;ll only use this to respond to you.
                    </p>
                    {errors.email && (
                      <p className="text-xs text-gray-500 mt-1 font-light">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      className={`w-full px-4 py-3 border transition-colors bg-white focus:outline-none resize-none ${
                        errors.message
                          ? "border-gray-300 focus:border-gray-400"
                          : "border-gray-300 focus:border-black"
                      }`}
                      placeholder="Your message..."
                    />
                    {errors.message && (
                      <p className="text-xs text-gray-500 mt-2 font-light">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    className="w-full py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </ScrollReveal>

            {/* Contact Info */}
            <ScrollReveal delay={100}>
              <div>
                <h2 className="text-3xl font-light tracking-wider mb-12 font-serif">
                  Other ways to connect
                </h2>

                <div className="space-y-12">
                  {/* Email */}
                  <div>
                    <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                      Email
                    </p>
                    <a
                      href="mailto:hello@eora.com"
                      className="text-lg font-light hover:text-gray-600 transition-colors"
                    >
                      hello@eora.com
                    </a>
                  </div>

                  {/* Phone */}
                  <div>
                    <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                      Phone
                    </p>
                    <a
                      href="tel:+1234567890"
                      className="text-lg font-light hover:text-gray-600 transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>

                  {/* Social */}
                  <div>
                    <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                      Follow
                    </p>
                    <div className="flex gap-6">
                      <a
                        href="#instagram"
                        className="text-lg font-light hover:text-gray-600 transition-colors"
                      >
                        Instagram
                      </a>
                      <a
                        href="#twitter"
                        className="text-lg font-light hover:text-gray-600 transition-colors"
                      >
                        Twitter
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div>
                    <p className="text-xs font-light tracking-widest uppercase text-gray-600 mb-3">
                      Hours
                    </p>
                    <div className="space-y-2 text-sm font-light">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday - Sunday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-500 pt-2">(All times in EST)</p>
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
