import Link from "next/link";
import { db } from "@/lib/db";
import { categories, store, topReels } from "@/config/store";
import { Hero, type HeroSlide } from "@/components/hero/Hero";
import { KoreanHero, type WallItem } from "@/components/hero/KoreanHero";
import { ProductCard } from "@/components/ProductCard";
import { ProductImg, pickImage } from "@/components/ProductImg";
import type { Product } from "@/lib/types";
import { canTryOn } from "@/lib/tryon";

export const dynamic = "force-dynamic";

const tiles: Record<string, string> = {
  "korean-earrings": "#FAD4E4",
  "anti-tarnish": "#F6C9D6",
  earrings: "#CDE5DA",
  "necklace-sets": "#EFE4D2",
  hasli: "#F3D9C4",
  bracelets: "#E3DDF3",
  rings: "#F1E3C8",
  kurtis: "#FBE3CF",
};

function real(products: Product[], slug: string, fallbackName: string, fallbackHref: string) {
  const p = products.find((x) => x.slug === slug);
  return p ? { name: p.name, image: pickImage(p)?.url ?? null, href: `/p/${p.slug}` } : { name: fallbackName, image: null, href: fallbackHref };
}

export default async function Home() {
  const products = await db.listProducts();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const byCategory = (slug: string) => products.find((p) => p.category === slug);
  const tryOnHref = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    return p && canTryOn(p) ? `/try-on/${p.slug}` : null;
  };
  const tryOnStar = products.find((p) => p.tryOn === "earrings" && canTryOn(p)) ?? products.find(canTryOn);

  const slides: HeroSlide[] = [
    {
      word: "WON'T FADE",
      eyebrow: "Anti-tarnish everyday",
      line: "Chains, rings and combos that stay golden. Pehno roz, bina tension.",
      price: "From ₹149",
      tag1: "ANTI-TARNISH",
      tag2: "DAILY WEAR",
      bg: "#F6C9D6",
      ink: "#5A0F2E",
      href: "/shop/anti-tarnish",
      alt3d: "3D gold clover pendant with an emerald centre",
      real: real(products, "anti-tarnish-clover-pendant", "Anti-tarnish", "/shop/anti-tarnish"),
    },
    {
      word: "KASHMIRI",
      eyebrow: "Kashmiri kundan earrings",
      line: "Red, green and pink kundan jhumkas. Lowest price in Nashik.",
      price: "Just ₹99",
      tag1: "KUNDAN",
      tag2: "LIGHTWEIGHT",
      bg: "#0E5A45",
      ink: "#FFF1DC",
      href: "/shop/earrings",
      tryOnHref: tryOnHref("kashmiri-kundan-earrings"),
      alt3d: "3D pair of kundan jhumkas, one ruby and one emerald",
      real: real(products, "kashmiri-kundan-earrings", "Earrings", "/shop/earrings"),
    },
    {
      word: "RAJWADI",
      eyebrow: "Hasli necklace sets",
      line: "Instagram's hot-selling hasli sets, ready for the festive season.",
      price: "Just ₹599",
      tag1: "HOT SELLING",
      tag2: "WITH EARRINGS",
      bg: "#6B1026",
      ink: "#F2C14E",
      href: "/shop/hasli",
      tryOnHref: tryOnHref("hasli-necklace-set"),
      alt3d: "3D gold hasli collar with ruby and emerald stones and a pearl drop",
      real: real(products, "hasli-necklace-set", "Hasli sets", "/shop/hasli"),
    },
    {
      word: "3 FOR 999",
      eyebrow: "Branded kurti combo",
      line: "Pick any three branded kurtis. The deal applies in your cart.",
      price: "3 for ₹999",
      tag1: "BRANDED",
      tag2: "RESTOCKED",
      bg: "#F28C28",
      ink: "#3B1406",
      href: "/shop/kurtis",
      alt3d: "3D pink kurti with a gold border on a hanger",
      real: real(products, "branded-cotton-kurti", "Kurtis", "/shop/kurtis"),
    },
  ];

  // While the Korean Earrings launch is on, its photo wall replaces the 3D slideshow.
  const korean = products.filter((p) => p.category === "korean-earrings");
  const liveCategories = categories.filter((c) => byCategory(c.slug));
  const hasKurtis = products.some((p) => p.category === "kurtis");
  const wall: WallItem[] = korean
    .map((p) => ({ slug: p.slug, name: p.name, price: p.price, image: pickImage(p)?.url ?? "" }))
    .filter((w) => w.image)
    .slice(0, 24);

  return (
    <>
      {wall.length >= 6 ? (
        <KoreanHero
          items={wall}
          href="/shop/korean-earrings"
          startPrice={Math.min(...korean.map((p) => p.price))}
          count={korean.length}
          whatsapp={store.whatsapp}
        />
      ) : (
        <Hero slides={slides} />
      )}

      {liveCategories.length > 1 && (
      <section className="mx-auto max-w-[1320px] px-4 pt-14 md:px-6 md:pt-[72px]">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2 md:mb-7">
          <h2 className="font-display m-0 text-[40px] leading-none md:text-[64px]">SHOP BY VIBE</h2>
          <p className="m-0 text-sm text-muted md:text-base">Roz pehno, ya shaadi mein. Sab kuch yahin.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-8 md:gap-[18px]">
          {categories.filter((c) => byCategory(c.slug)).map((c) => {
            const p = byCategory(c.slug);
            return (
              <Link key={c.slug} href={`/shop/${c.slug}`} className="group flex flex-col gap-2 no-underline md:gap-3">
                <div className="arch aspect-[4/5] overflow-hidden" style={{ background: tiles[c.slug] }}>
                  {p ? <ProductImg p={p} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" /> : <div className="placeholder-stripes size-full" />}
                </div>
                <span className="text-center text-[13px] font-bold md:text-left md:text-[17px]">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>
      )}

      {featured.length > 0 && (
        <section className="mx-auto max-w-[1320px] px-4 pt-12 md:px-6 md:pt-14">
          <div className="mb-5 flex items-end justify-between md:mb-7">
            <h2 className="font-display m-0 text-[40px] leading-none md:text-[64px]">INSTAGRAM PE HIT</h2>
            <Link href="/shop" className="text-sm font-bold md:text-[15px]">View all</Link>
          </div>
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-[22px]">
            {featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {hasKurtis ? (
        <section className="mx-auto max-w-[1320px] px-3 pt-12 md:px-6 md:pt-14">
          <div className="flex flex-col gap-4 rounded-[28px] bg-saffron p-6 text-[#3B1406] md:flex-row md:items-center md:gap-10 md:rounded-[32px] md:p-14">
            <div className="flex flex-1 flex-col gap-3">
              <span className="font-serif-italic text-xl md:text-2xl">Kurti combo</span>
              <h2 className="font-display m-0 text-[58px] leading-[.92] md:text-[96px]">3 FOR ₹999</h2>
              <p className="m-0 max-w-[440px] text-[15px] leading-normal md:text-[17px]">
                Add any three branded kurtis to your cart. The combo price applies by itself at checkout.
              </p>
            </div>
            <Link href="/shop/kurtis" className="self-start rounded-full bg-[#3B1406] px-7 py-4 text-base font-bold text-[#FFF1DC] no-underline md:self-center">
              Pick your three
            </Link>
          </div>
        </section>
      ) : korean.length > 0 ? (
        <section className="mx-auto max-w-[1320px] px-3 pt-12 md:px-6 md:pt-14">
          <div className="relative flex flex-col gap-6 overflow-hidden rounded-[28px] bg-saffron p-6 text-[#3B1406] md:flex-row md:items-center md:gap-10 md:rounded-[32px] md:p-14">
            <div className="flex flex-1 flex-col gap-3">
              <span className="font-serif-italic text-xl md:text-2xl">Korean earrings</span>
              <h2 className="font-display m-0 text-[52px] leading-[.92] md:text-[96px]">A PAIR FOR<br />EVERY OUTFIT</h2>
              <p className="m-0 max-w-[440px] text-[15px] leading-normal md:text-[17px]">
                {korean.length} styles: pearls, bows, tulips and hearts. Every pair is under ₹{Math.ceil((Math.max(...korean.map((p) => p.price)) + 1) / 100) * 100 - 1}, so pick one for college, one for office and one for the weekend.
              </p>
              <Link href="/shop/korean-earrings" className="mt-2 self-start rounded-full bg-[#3B1406] px-7 py-4 text-base font-bold text-[#FFF1DC] no-underline">
                See all {korean.length}
              </Link>
            </div>
            <div className="relative flex h-[200px] shrink-0 items-center justify-center md:h-[280px] md:w-[420px]">
              {wall.slice(3, 6).map((w, k) => (
                <Link
                  key={w.slug}
                  href={`/p/${w.slug}`}
                  className="absolute w-[130px] rounded-[20px] bg-paper p-1.5 shadow-[0_20px_40px_-16px_rgba(59,20,6,.6)] transition-transform duration-300 hover:z-10 hover:!rotate-0 hover:scale-110 md:w-[180px]"
                  style={{ transform: `translateX(${(k - 1) * 62}%) rotate(${(k - 1) * 9}deg) translateY(${k === 1 ? -10 : 8}px)`, zIndex: k === 1 ? 2 : 1 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.image} alt={w.name} loading="lazy" className="aspect-[4/5] w-full rounded-[15px] object-cover" />
                  <span className="absolute right-3 top-3 rounded-full bg-[#3B1406] px-2.5 py-0.5 text-[12px] font-bold text-[#FFF1DC]">₹{w.price}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tryOnStar ? (
        <section className="mx-auto max-w-[1320px] px-3 pt-5 md:px-6 md:pt-6">
          <div className="flex items-center gap-5 rounded-[28px] bg-maroon p-6 text-[#FFF1E0] md:gap-12 md:rounded-[32px] md:p-14">
            <div className="arch hidden h-[220px] w-[170px] shrink-0 items-center justify-center border-2 border-gold bg-[#4A0A1A] sm:flex">
              <svg width="70%" viewBox="0 0 160 200" fill="none" stroke="#E9B949" strokeWidth="3" strokeDasharray="5 7" aria-hidden>
                <ellipse cx="80" cy="88" rx="52" ry="66" />
                <path d="M40 196c6-30 22-40 40-40s34 10 40 40" />
              </svg>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-serif-italic text-xl text-gold md:text-2xl">Live try-on</span>
              <h2 className="font-display m-0 text-[36px] leading-[.95] md:text-[84px]">PEHNO, PHIR LO</h2>
              <p className="m-0 max-w-[460px] text-sm leading-relaxed md:text-[17px]">
                Open your camera and see the earrings on you before you buy. It runs on your phone, and your video never leaves it.
              </p>
              {tryOnStar && (
                <Link href={`/try-on/${tryOnStar.slug}`} className="self-start rounded-full bg-gold px-6 py-3.5 text-[15px] font-bold text-[#3B0614] no-underline md:text-base">
                  Start try-on
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-[1320px] px-3 pt-5 md:px-6 md:pt-6">
          <div className="flex items-center gap-5 rounded-[28px] bg-maroon p-6 text-[#FFF1E0] md:gap-12 md:rounded-[32px] md:p-14">
            <div className="arch hidden h-[220px] w-[170px] shrink-0 items-center justify-center border-2 border-gold bg-[#4A0A1A] sm:flex">
              <svg width="62%" viewBox="0 0 120 120" fill="none" stroke="#E9B949" strokeWidth="3" strokeLinejoin="round" aria-hidden>
                <path d="M60 14c-26 0-46 18-46 42 0 9 3 17 8 24l-6 22 23-6c6 3 13 5 21 5 26 0 46-18 46-43S86 14 60 14Z" strokeDasharray="5 7" />
                <path d="M42 50h36M42 64h24" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-serif-italic text-xl text-gold md:text-2xl">Order your way</span>
              <h2 className="font-display m-0 text-[36px] leading-[.95] md:text-[84px]">UPI, CARD YA WHATSAPP</h2>
              <p className="m-0 max-w-[480px] text-sm leading-relaxed md:text-[17px]">
                Pay online with UPI or a card, or just send us the earring names on WhatsApp and we&apos;ll pack them. We ship all over India.
              </p>
              <a
                href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent("Hi! I want to order Korean earrings from your website.")}`}
                className="self-start rounded-full bg-gold px-6 py-3.5 text-[15px] font-bold text-[#3B0614] no-underline md:text-base"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="pt-12 md:mx-auto md:max-w-[1320px] md:px-6 md:pt-14">
        <div className="mb-4 flex items-end justify-between px-4 md:mb-6 md:px-0">
          <h2 className="font-display m-0 text-[40px] leading-none md:text-[64px]">ON THE REELS</h2>
          <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-bold md:text-[15px]">@{store.instagramHandle}</a>
        </div>
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 md:grid md:grid-cols-5 md:gap-3.5 md:px-0">
          {topReels.map((r) => (
            <a
              key={r.code}
              href={`https://www.instagram.com/reel/${r.code}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch on Instagram: ${r.label}, ${r.views} views`}
              className="group relative block aspect-[9/14] w-[150px] shrink-0 overflow-hidden rounded-2xl bg-ink md:w-auto"
            >
              {/* Instagram's own embed shows the reel's current cover; it is not clickable, the whole tile is. */}
              <iframe
                src={`https://www.instagram.com/reel/${r.code}/embed/`}
                title={r.label}
                loading="lazy"
                tabIndex={-1}
                aria-hidden
                scrolling="no"
                className="pointer-events-none absolute -top-[56px] left-0 h-[calc(100%+260px)] w-full origin-[50%_56px] scale-[1.45] border-0"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent transition-opacity group-hover:opacity-70" />
              <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[12px] font-bold text-white backdrop-blur-sm">
                ▶ {r.views} views
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
