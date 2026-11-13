import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import SiteHeader from "../../src/components/SiteHeader";
import "../../src/styles/tokens.css";

// latin-ext carries the Turkish letters (ı, ş, ğ).
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
});
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
});

// Gives every shop page (the (magaza) group) the header and the design system.
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`design-system ${fraunces.variable} ${inter.variable}`}>
      <SiteHeader />
      {children}
    </div>
  );
}
