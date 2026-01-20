"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo — Agrandir Bold, no space */}
        <Link href="/" className="text-lg font-agrandir font-bold tracking-tighter" style={{ letterSpacing: "-0.04em" }}>
          e&apos;eora
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-8 items-center text-sm">
          <Link
            href="/"
            className="hover:underline transition-colors duration-200"
          >
            Home
          </Link>

          <Link
            href="/fragrances"
            className="hover:underline transition-colors duration-200"
          >
            Fragrances
          </Link>

          <Link
            href="/about"
            className="hover:underline transition-colors duration-200"
          >
            About
          </Link>

          <Link
            href="/contact"
            className="hover:underline transition-colors duration-200"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
