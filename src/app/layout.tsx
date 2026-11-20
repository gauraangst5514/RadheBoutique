import type { Metadata, Viewport } from "next";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Radhe Boutique Nashik | Anti-tarnish jewellery & kurtis", template: "%s | Radhe Boutique" },
  description:
    "Anti-tarnish jewellery, Kashmiri earrings, hasli sets and branded kurtis from Radhe Boutique, Nashik. Ships across India.",
};

export const viewport: Viewport = { themeColor: "#FFF7F2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
