"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRightSmall } from "@/components/icons";

export interface WallItem {
  slug: string;
  name: string;
  price: number;
  image: string;
}

/**
 * Homepage hero for the Korean Earrings launch: a big headline next to a tilted,
 * endlessly scrolling wall of the real product photos. Columns move in opposite
 * directions, pause on hover, and every tile opens its product. The wall leans
 * toward the mouse on desktop. With "reduce motion" on, nothing moves.
 */
export function KoreanHero({ items, href, startPrice, count, whatsapp }: { items: WallItem[]; href: string; startPrice: number; count: number; whatsapp: string }) {
  const wallRef = useRef<HTMLDivElement>(null);
  const star = items[0];

  // Gentle tilt toward the pointer (desktop only), smoothed with rAF.
  useEffect(() => {
    const el = wallRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(pointer: fine)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--tx", x.toFixed(3));
      el.style.setProperty("--ty", y.toFixed(3));
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Split the photos into 3 columns (desktop) and 2 rows (mobile).
  const cols = [0, 1, 2].map((c) => items.filter((_, k) => k % 3 === c));
  const rows = [0, 1].map((r) => items.filter((_, k) => k % 2 === r));
  const waText = encodeURIComponent("Hi! I saw the Korean earrings on your website and want to order.");

  return (
    <section aria-label="New: Korean earrings" className="px-3 md:px-4">
      <div className="kh relative mx-auto flex h-[640px] max-w-[1408px] flex-col overflow-hidden rounded-[28px] bg-blush text-maroon md:h-[660px] md:flex-row md:rounded-[32px]">
        {/* soft glow + grain */}
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-[#ff9cc0] opacity-50 blur-[110px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 right-[20%] size-[460px] rounded-full bg-gold opacity-30 blur-[120px]" />

        {/* ---------- copy ---------- */}
        <div className="relative z-[3] flex flex-col gap-4 px-5 pt-7 md:w-[46%] md:shrink-0 md:justify-center md:gap-6 md:pl-12 md:pr-4 md:pt-0">
          <span className="kh-in flex items-center gap-2 self-start rounded-full bg-maroon px-3.5 py-1.5 text-[11px] font-bold tracking-[.18em] text-blush md:text-xs">
            <span className="kh-dot size-2 rounded-full bg-gold" /> NEW DROP · {count} STYLES
          </span>
          <h1 className="font-display kh-in m-0 text-[72px] leading-[.86] tracking-tight md:text-[132px] lg:text-[150px]" style={{ animationDelay: "80ms" }}>
            EAR
            <br />
            <span className="kh-outline">CANDY</span>
            <span className="font-serif-italic ml-2 inline-block whitespace-nowrap align-top text-[26px] font-semibold normal-case tracking-normal text-pink md:ml-3 md:text-[44px]">from ₹{startPrice}</span>
          </h1>
          <p className="kh-in m-0 max-w-[400px] text-[15px] leading-relaxed md:text-lg" style={{ animationDelay: "160ms" }}>
            The earrings everyone&apos;s wearing: pearls, bows, tulips and hearts. Light enough for all day, priced from <b>₹{startPrice}</b>.
          </p>
          <div className="kh-in flex gap-2.5" style={{ animationDelay: "240ms" }}>
            <Link href={href} className="group flex items-center gap-2 rounded-full bg-maroon px-6 py-3.5 text-[15px] font-bold text-blush no-underline md:px-7 md:py-4 md:text-base">
              Shop the drop <span className="transition-transform group-hover:translate-x-1"><ArrowRightSmall /></span>
            </Link>
            <a href={`https://wa.me/${whatsapp}?text=${waText}`} className="rounded-full border-2 border-maroon px-5 py-3 text-[15px] font-bold text-maroon no-underline md:px-6 md:py-3.5 md:text-base">
              WhatsApp us
            </a>
          </div>
          <ul className="kh-in m-0 hidden list-none gap-5 p-0 text-sm font-bold md:flex" style={{ animationDelay: "320ms" }}>
            <li>✦ From ₹{startPrice}</li>
            <li>✦ Ships all India</li>
            <li>✦ UPI &amp; cards</li>
          </ul>
        </div>

        {/* ---------- desktop wall ---------- */}
        <div className="kh-stage relative hidden flex-1 md:block">
          <div ref={wallRef} className="kh-wall absolute -right-10 -top-[18%] flex h-[136%] w-[115%] gap-4">
            {cols.map((col, c) => (
              <div key={c} className="kh-col relative flex-1 overflow-hidden">
                <div className={`kh-track flex flex-col gap-4 ${c === 1 ? "kh-down" : "kh-up"}`} style={{ animationDuration: `${[46, 58, 40][c]}s` }}>
                  {[...col, ...col].map((it, k) => (
                    <Tile key={k} it={it} tabbable={k < col.length} tilt={(k % 3) - 1} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {star && (
            <Link href={`/p/${star.slug}`} className="kh-badge absolute bottom-10 left-6 z-[4] block size-[132px] text-maroon no-underline" aria-label={`Bestseller: ${star.name}, ₹${star.price}`}>
              <svg viewBox="0 0 120 120" className="kh-spin absolute inset-0 size-full">
                <defs>
                  <path id="kh-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                </defs>
                <circle cx="60" cy="60" r="59" fill="#E9B949" />
                <text fontSize="11" fontWeight="700" fill="#6B1026">
                  <textPath href="#kh-circle" textLength="286" lengthAdjust="spacing">BESTSELLER ✦ BESTSELLER ✦ BESTSELLER ✦</textPath>
                </text>
              </svg>
              <span className="absolute inset-[30px] flex flex-col items-center justify-center rounded-full bg-maroon text-blush">
                <span className="text-[10px] font-bold tracking-widest">ONLY</span>
                <span className="font-display text-[28px] leading-none">₹{star.price}</span>
              </span>
            </Link>
          )}
        </div>

        {/* ---------- mobile rows ---------- */}
        <div aria-hidden className="relative mt-auto flex -rotate-[5deg] flex-col gap-3 pb-10 md:hidden">
          {rows.map((row, r) => (
            <div key={r} className="overflow-hidden">
              <div className={`kh-track flex w-max gap-3 ${r ? "kh-right" : "kh-left"}`} style={{ animationDuration: `${[38, 44][r]}s` }}>
                {[...row, ...row].map((it, k) => (
                  <Tile key={k} it={it} small tabbable={false} tilt={0} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tile({ it, small, tabbable, tilt }: { it: WallItem; small?: boolean; tabbable: boolean; tilt: number }) {
  return (
    <Link
      href={`/p/${it.slug}`}
      tabIndex={tabbable ? 0 : -1}
      aria-hidden={tabbable ? undefined : true}
      className={`kh-tile group relative block shrink-0 overflow-hidden rounded-[22px] bg-paper p-1.5 text-ink no-underline shadow-[0_18px_40px_-18px_rgba(107,16,38,.55)] ${small ? "w-[128px]" : "w-full"}`}
      style={{ ["--r" as string]: `${tilt * 1.5}deg` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={it.image} alt={it.name} loading="lazy" className={`block w-full rounded-[17px] object-cover transition-transform duration-500 group-hover:scale-110 ${small ? "aspect-square" : "aspect-[4/5]"}`} />
      <span className={`absolute right-3 top-3 rounded-full bg-maroon font-bold text-blush ${small ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-[13px]"}`}>₹{it.price}</span>
      {!small && (
        <span className="absolute inset-x-1.5 bottom-1.5 translate-y-full rounded-b-[17px] bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 text-[13px] font-bold text-white transition-transform duration-300 group-hover:translate-y-0">
          {it.name}
        </span>
      )}
    </Link>
  );
}
