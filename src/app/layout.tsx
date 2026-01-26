import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";
import { ClientProviders } from "@/src/components/ClientProviders";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "e'eora | Quiet Fragrances",
  description:
    "e'eora. A quiet expression of scent. Thoughtfully crafted fragrances that speak softly.",
  keywords: "fragrance, perfume, luxury, minimal, scent",
  openGraph: {
    title: "e'eora | Quiet Fragrances",
    description: "A quiet expression of scent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.className}>
      <body className="bg-white dark:bg-gray-900 transition-colors duration-300">
        <ClientProviders>
          <AppShell>{children}</AppShell>
        </ClientProviders>
      </body>
    </html>
  );
}
