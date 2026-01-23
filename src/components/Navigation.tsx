"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 animate-slide-down">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo — Agrandir Bold, no space */}
        <Link 
          href="/" 
          className="text-2xl font-agrandir font-bold tracking-tighter hover:opacity-80 transition-opacity duration-300" 
          style={{ letterSpacing: "-0.04em" }}
        >
          e&apos;eora
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
              className="relative py-1 text-gray-600 hover:text-black transition-colors duration-300 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
        
        {/* Mobile Menu Icon (Placeholder for now) */}
        <div className="md:hidden">
          {/* Add hamburger menu logic later if needed */}
        </div>
      </div>
    </nav>
  );
}
