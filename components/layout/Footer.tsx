import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-20">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl text-gold mb-4">Radhe Boutique</h3>
            <p className="text-ivory/60 text-sm mb-4">
              Crafted for Eternity
            </p>
            <div className="flex space-x-4">
              <a
                href={`https://instagram.com/${process.env.NEXT_PUBLIC_BRAND_INSTAGRAM?.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/60 hover:text-gold transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/60 hover:text-gold transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-ivory mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-ivory/60 hover:text-gold transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rings" className="text-ivory/60 hover:text-gold transition-colors">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="text-ivory/60 hover:text-gold transition-colors">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="text-ivory/60 hover:text-gold transition-colors">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets" className="text-ivory/60 hover:text-gold transition-colors">
                  Bracelets
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-ivory mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-ivory/60 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ivory/60 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-ivory/60 hover:text-gold transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-ivory mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-ivory/60">
              <li>Free Shipping above ₹5000</li>
              <li>30-Day Returns</li>
              <li>BIS Hallmarked</li>
              <li>
                <a href={`mailto:${process.env.NEXT_PUBLIC_BRAND_EMAIL}`} className="hover:text-gold transition-colors">
                  {process.env.NEXT_PUBLIC_BRAND_EMAIL}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_BRAND_WHATSAPP?.replace(/\D/g, '')}`} className="hover:text-gold transition-colors">
                  {process.env.NEXT_PUBLIC_BRAND_WHATSAPP}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 mt-2">
          <p className="text-sm text-ivory/40 text-center">
            &copy; 2026 Radhe Boutique. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
