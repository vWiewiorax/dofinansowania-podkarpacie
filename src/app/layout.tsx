import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dofinansowania i darmowe kursy na Podkarpaciu",
  description:
    "Aktualne dotacje, nabory wniosków, dofinansowane kursy i bezpłatne szkolenia w województwie podkarpackim, zebrane z oficjalnych źródeł i podzielone na kategorie.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
