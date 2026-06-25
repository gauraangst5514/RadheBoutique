import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat, Marcellus } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ScrollReveal from "@/components/ScrollReveal";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marcellus",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Radhe Boutique - Luxury Jewellery | Crafted for Eternity",
  description:
    "Discover exquisite handcrafted jewellery at Radhe Boutique. From diamond rings to gold necklaces, each piece is crafted with precision and elegance. Shop certified, hallmarked jewellery with free shipping.",
  keywords: [
    "luxury jewellery",
    "diamond rings",
    "gold necklaces",
    "handcrafted jewellery",
    "certified jewellery",
    "Radhe Boutique",
  ],
  authors: [{ name: "Radhe Boutique" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://radheboutique.com",
    siteName: "Radhe Boutique",
    title: "Radhe Boutique - Luxury Jewellery",
    description: "Exquisite handcrafted jewellery crafted for eternity",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Radhe Boutique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Radhe Boutique - Luxury Jewellery",
    description: "Exquisite handcrafted jewellery crafted for eternity",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${marcellus.variable} ${cormorant.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <ScrollReveal />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#2c1810",
              border: "1px solid #e8dfd4",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            },
            success: {
              iconTheme: {
                primary: "#a67c52",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
