import type { Metadata } from "next";
import "./globals.css";
import AppShell from "./AppShell";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
