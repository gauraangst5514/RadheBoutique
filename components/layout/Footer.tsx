import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";

const LOGO_URL = "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782393712/radhe-logo_1_1_vikvi1.png";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <Image src={LOGO_URL} alt="Radhe Boutique" width={32} height={32} className="rounded-full" />
              <h3 className="font-display text-xl text-gold">Radhe Boutique</h3>
            </div>
            <p className="text-ivory/45 text-sm leading-relaxed mb-5">
              Anti-tarnish jewellery crafted for everyday elegance. Premium quality, lasting shine.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={`https://instagram.com/${(process.env.NEXT_PUBLIC_BRAND_INSTAGRAM || "@radheboutique").replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ivory/50 hover:text-gold hover:border-gold transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ivory/50 hover:text-gold hover:border-gold transition-colors"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ivory/70 mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/shop?category=rings", label: "Rings" },
                { href: "/shop?category=necklaces", label: "Necklaces" },
                { href: "/shop?category=earrings", label: "Earrings" },
                { href: "/shop?category=bracelets", label: "Bracelets" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ivory/45 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ivory/70 mb-5">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/account/orders", label: "Track Order" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ivory/45 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ivory/70 mb-5">Customer Care</h4>
            <ul className="space-y-3 text-sm text-ivory/45">
              <li>Free Shipping above ₹499</li>
              <li>30-Day Returns</li>
              <li>Anti-Tarnish Quality</li>
              <li>
                <a href={`mailto:${process.env.NEXT_PUBLIC_BRAND_EMAIL}`} className="hover:text-gold transition-colors">
                  {process.env.NEXT_PUBLIC_BRAND_EMAIL}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${(process.env.NEXT_PUBLIC_BRAND_WHATSAPP || "").replace(/\D/g, "")}`} className="hover:text-gold transition-colors">
                  {process.env.NEXT_PUBLIC_BRAND_WHATSAPP}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <p className="text-[12px] text-ivory/30 text-center tracking-wide">
            &copy; 2026 Radhe Boutique. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
