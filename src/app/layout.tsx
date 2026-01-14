import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Perfume Website",
  description: "Discover exquisite perfumes and fragrances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
