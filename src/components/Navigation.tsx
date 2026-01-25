"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // New state for animation

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsAnimating(false); // Start closing animation
      // Delay unmounting until after the transition
      setTimeout(() => setIsMobileMenuOpen(false), 300); // 300ms matches transition duration
    } else {
      setIsMobileMenuOpen(true); // Mount the menu
      // Allow a very small delay for the element to be mounted before starting the animation
      setTimeout(() => setIsAnimating(true), 10);
    }
  };

  useEffect(() => {
    // Use isAnimating to control body overflow, as it reflects the visual state
    if (isAnimating) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isAnimating]); // Depend on isAnimating

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 animate-slide-down">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo — Agrandir Bold, no space */}
          <Link 
            href="/" 
            className="text-2xl font-agrandir font-bold tracking-tighter hover:opacity-80 transition-opacity duration-300" 
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
                className="relative py-1 text-gray-600 hover:text-black transition-colors duration-300 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-black focus:outline-none">
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-0 z-[999] bg-black bg-opacity-50 md:hidden transition-opacity duration-300 ${
            isAnimating ? "opacity-100" : "opacity-0"
          }`}
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white/90 backdrop-blur-md z-[1000] flex flex-col shadow-lg transform transition-transform duration-300 ease-out ${
            isAnimating ? "translate-x-0" : "translate-x-full"
          } overflow-y-auto`} // Added overflow-y-auto for internal scrolling
        >
          <div className="flex justify-end p-4">
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-black focus:outline-none">
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center flex-grow space-y-8">
            {[
              { name: "Home", href: "/" },
              { name: "Fragrances", href: "/fragrances" },
              { name: "About", href: "/about" },
              { name: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-agrandir font-bold text-gray-800 hover:text-black transition-colors duration-300"
                onClick={toggleMobileMenu} // Close menu on link click
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
