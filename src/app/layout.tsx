import type { Metadata, Viewport } from "next";
import { store } from "@/config/store";
import "./globals.css";

const site = (process.env.NEXT_PUBLIC_SITE_URL || store.siteUrl).replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: {
    default: "Radhe Boutique Nashik | Korean earrings, anti-tarnish jewellery & kurtis",
    template: "%s | Radhe Boutique Nashik",
  },
  description:
    "Trendy Korean earrings from ₹29, anti-tarnish jewellery and kurtis from Radhe Boutique, Roongtha SSRF Mall, Nashik. Order on WhatsApp, free shipping across India on ₹299+.",
  applicationName: store.name,
  keywords: [
    "Radhe Boutique",
    "Radhe Boutique Nashik",
    "Korean earrings",
    "Korean earrings online India",
    "earrings under 100",
    "anti-tarnish jewellery",
    "jewellery shop Nashik",
    "artificial jewellery Nashik",
    "kurtis Nashik",
    "Roongtha SSRF Mall",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: store.name,
    locale: "en_IN",
    url: "/",
    title: "Radhe Boutique Nashik | Trendy jewellery from ₹29",
    description: "Korean earrings, anti-tarnish jewellery and kurtis. Order on WhatsApp, free shipping on ₹299+.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
  formatDetection: { telephone: true },
};

export const viewport: Viewport = { themeColor: "#FFF7F2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
