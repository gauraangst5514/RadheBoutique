"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categories } from "@/config/store";
import { cartCount, useCart } from "@/lib/cart";
import { CartIcon, CloseIcon, MenuIcon } from "@/components/icons";

export function Header() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-xs text-[#FFE9F0] md:text-[13px]">
        Shipping across India <span aria-hidden>·</span> Visit us at Roongtha SSRF Mall, Nashik
      </div>
      <header className="mx-auto flex max-w-[1320px] items-center gap-4 px-2 py-2 md:gap-7 md:px-6 md:py-4">
        <button aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)} className="flex size-11 items-center justify-center rounded-full md:hidden">
          <MenuIcon />
        </button>
        <Link href="/" className="flex flex-1 flex-col items-center leading-none no-underline md:flex-none md:items-start">
          <span className="font-serif-italic text-2xl font-bold text-maroon md:text-[30px]">Radhe Boutique</span>
          <span className="mt-1 text-[9px] tracking-[.32em] text-[#8A4A62] md:text-[11px]">NASHIK</span>
        </Link>
        <nav aria-label="Main" className="hidden flex-1 flex-wrap gap-5 text-[15px] font-medium md:flex">
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop/${c.slug}`} className="no-underline hover:text-pink">
              {c.name}
            </Link>
          ))}
        </nav>
        <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative flex size-11 items-center justify-center rounded-full">
          <CartIcon />
          {count > 0 && (
            <span key={count} className="cart-pop absolute right-0.5 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-maroon px-1 text-[11px] font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setOpen(false)}>
          <nav
            aria-label="Menu"
            className="flex h-full w-[82%] max-w-[320px] flex-col gap-1 bg-cream p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="mb-2 flex size-11 items-center justify-center self-end rounded-full">
              <CloseIcon />
            </button>
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop/${c.slug}`} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-lg font-bold no-underline hover:bg-blush">
                {c.name}
              </Link>
            ))}
            <Link href="/shop" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-lg font-bold no-underline hover:bg-blush">
              Everything
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
