"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Admin area has its own header + sidebar layout
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      {children}
      <ScrollToTop />
      <Footer />
    </>
  );
}

