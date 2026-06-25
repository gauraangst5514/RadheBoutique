"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Search, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import AnnouncementBar from "./AnnouncementBar";

interface NavbarProps {
  user?: { name?: string | null; role?: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const getCartCount = useCartStore((state) => state.getCartCount);

  useEffect(() => {
    setCartCount(getCartCount());
    const unsubscribe = useCartStore.subscribe(() => {
      setCartCount(useCartStore.getState().getCartCount());
    });
    return unsubscribe;
  }, [getCartCount]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Editable announcement bar (self-loads from settings) */}
      <AnnouncementBar />

      <nav
        className={cn(
          "transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border"
            : "bg-bg/80 backdrop-blur-sm border-b border-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="font-display text-xl md:text-2xl text-gold hover:text-gold/80 transition-colors">
              Radhe Boutique
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "gold-underline text-ivory hover:text-gold transition-colors text-sm tracking-wide",
                    pathname === link.href && "active text-gold"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/search" className="text-ivory hover:text-gold transition-colors">
                <Search size={20} />
              </Link>
              <Link href="/wishlist" className="text-ivory hover:text-gold transition-colors">
                <Heart size={20} />
              </Link>
              <Link href="/cart" className="relative text-ivory hover:text-gold transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href={user ? "/account" : "/login"} className="text-ivory hover:text-gold transition-colors">
                <User size={20} />
              </Link>
              <button className="md:hidden text-ivory hover:text-gold" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-ivory hover:text-gold transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
