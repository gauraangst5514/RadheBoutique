import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
