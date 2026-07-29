"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import AnnouncementBar from "./AnnouncementBar";
import { signOut } from "next-auth/react";
import Image from "next/image";

const LOGO_URL = "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782393712/radhe-logo_1_1_vikvi1.png";

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
      <AnnouncementBar />

      <nav
        className={cn(
          "transition-all duration-300 border-b",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-border"
            : "bg-bg border-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[72px]">
            {/* Left: Navigation links (desktop) */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[13px] tracking-[0.08em] uppercase font-medium transition-colors duration-200",
                    pathname === link.href
                      ? "text-gold"
                      : "text-ivory/70 hover:text-gold"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Center: Logo */}
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity lg:absolute lg:left-1/2 lg:-translate-x-1/2">
              <Image src={LOGO_URL} alt="Radhe Boutique" width={34} height={34} className="rounded-full" />
              <span className="font-display text-[22px] text-gold tracking-wide">
                Radhe Boutique
              </span>
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-5 flex-1 justify-end">
              <Link href="/search" className="text-ivory/60 hover:text-gold transition-colors hidden sm:block" aria-label="Search">
                <Search size={19} strokeWidth={1.5} />
              </Link>
              <Link href="/wishlist" className="text-ivory/60 hover:text-gold transition-colors hidden sm:block" aria-label="Wishlist">
                <Heart size={19} strokeWidth={1.5} />
              </Link>
              <Link href="/cart" className="relative text-ivory/60 hover:text-gold transition-colors" aria-label="Cart">
                <ShoppingCart size={19} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href={user ? "/account" : "/login"} className="text-ivory/60 hover:text-gold transition-colors hidden sm:block" aria-label="Account">
                <User size={19} strokeWidth={1.5} />
              </Link>
              {user && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-ivory/60 hover:text-gold transition-colors hidden sm:block"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut size={17} strokeWidth={1.5} />
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden text-ivory/70 hover:text-gold transition-colors ml-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-white animate-[slide-down_0.2s_ease-out]">
            <div className="container mx-auto px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block py-3 px-2 text-[13px] tracking-[0.06em] uppercase font-medium rounded transition-colors",
                    pathname === link.href
                      ? "text-gold bg-gold/5"
                      : "text-ivory/70 hover:text-gold hover:bg-gold/5"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-border flex items-center gap-6">
                <Link href="/search" className="text-ivory/60 hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <Search size={19} strokeWidth={1.5} />
                </Link>
                <Link href="/wishlist" className="text-ivory/60 hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <Heart size={19} strokeWidth={1.5} />
                </Link>
                <Link href={user ? "/account" : "/login"} className="text-ivory/60 hover:text-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <User size={19} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
