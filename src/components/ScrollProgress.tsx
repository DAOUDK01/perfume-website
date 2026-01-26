"use client";

import { useScrollProgress } from "@/hooks/useScrollReveal";
import { useEffect, useState } from "react";

interface ScrollProgressProps {
  sections: string[];
}

export default function ScrollProgress({ sections }: ScrollProgressProps) {
  const currentSection = useScrollProgress();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
      {sections.map((section, index) => (
        <button
          key={index}
          onClick={() => {
            const element = document.querySelector(
              `[data-scroll-section="${index}"]`
            );
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className={`transition-all duration-300 ${
            currentSection === index
              ? "w-2 h-2 bg-black"
              : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
          } rounded-full`}
          title={section}
          aria-label={`Jump to ${section}`}
          style={
            prefersReducedMotion
              ? { transitionDuration: "0ms" }
              : { transitionDuration: "300ms" }
          }
        />
      ))}
    </div>
  );
}
