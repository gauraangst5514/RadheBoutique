"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { categoryName } from "@/config/store";
import type { Product } from "@/lib/types";
import { rupees } from "@/lib/pricing";
import { stockLabel } from "@/lib/stock";
import { useCart } from "@/lib/cart";
import { waLink, waProductText } from "@/lib/whatsapp";
import { ProductImg, pickImage } from "@/components/ProductImg";
import { TryOnIcon } from "@/components/icons";
import { tryOnOptions } from "@/lib/tryon";
import { TrustStrip } from "@/components/motion/TrustStrip";

const toneClass = { ok: "text-ok", warn: "text-warn", bad: "text-bad" } as const;

export function ProductClient({ product: p, siteUrl }: { product: Product; siteUrl: string }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const firstInStock = Math.max(0, p.variants.findIndex((v) => v.stock > 0));
  const [vi, setVi] = useState(firstInStock);
  const [img, setImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [phone, setPhone] = useState("");
  const [notify, setNotify] = useState<"idle" | "sending" | "done" | "error">("idle");

  const v = p.variants[vi];
  const label = v ? stockLabel(v) : { text: "Unavailable", tone: "bad" as const };
  const inStock = Boolean(v && v.stock > 0);
  const images = p.images.length ? p.images : [];
  const main = images[img] ?? null;

  function addToCart(goToCart = false) {
    if (!v) return;
    add({
      productId: p.id,
      variantId: v.id,
      slug: p.slug,
      name: p.name,
      variantName: v.name,
      category: p.category,
      unitPrice: p.price,
      image: pickImage(p)?.url ?? null,
      maxQty: v.stock,
    });
    if (goToCart) router.push("/cart");
    else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    }
  }

  async function askRestock(e: React.FormEvent) {
    e.preventDefault();
    if (!v) return;
    setNotify("sending");
    const res = await fetch("/api/restock", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: p.id, variantId: v.id, phone }),
    });
    setNotify(res.ok ? "done" : "error");
  }

  const pageUrl = `${siteUrl}/p/${p.slug}`;

  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-12">
      {/* gallery */}
      <div className="flex flex-col gap-2.5">
        <div className="pd-img group relative aspect-square overflow-hidden rounded-[26px] bg-[#F3E7DF]">
          <ProductImg p={p} img={main} className="size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
          <span aria-hidden className="lady-twinkle pointer-events-none absolute right-4 top-4 text-2xl text-gold">✦</span>
          <span aria-hidden className="lady-twinkle pointer-events-none absolute bottom-6 right-10 text-lg text-white" style={{ animationDelay: "-1.2s" }}>✦</span>
          <span aria-hidden className="lady-twinkle pointer-events-none absolute bottom-12 left-6 text-xl text-pink" style={{ animationDelay: "-2s" }}>✦</span>
          {main && (
            <span className="absolute left-3 top-3 rounded-full bg-paper px-2.5 py-1.5 text-xs font-bold">
              {main.kind === "cutout" ? "Studio shot" : main.kind === "lifestyle" ? "Styled shot" : "Real photo"}
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2.5">
            {images.map((im, k) => (
              <button
                key={im.url}
                aria-label={`Show image ${k + 1}`}
                aria-pressed={k === img}
                onClick={() => setImg(k)}
                className={`size-16 overflow-hidden rounded-xl p-0 ${k === img ? "border-[3px] border-pink" : "border border-[#D9B8C4]"}`}
              >
                <ProductImg p={p} img={im} className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-bold tracking-[.14em] text-[#8A4A62]">{categoryName(p.category).toUpperCase()}</span>
          <h1 className="font-display m-0 text-[36px] leading-[1.02] md:text-[52px]">{p.name.toUpperCase()}</h1>
        </div>
        <div className="flex items-baseline gap-3">
          <span key={p.id} className="price-pop text-[30px] font-bold text-pink">{rupees(p.price)}</span>
          {p.mrp && p.mrp > p.price && <span className="text-lg text-muted line-through">{rupees(p.mrp)}</span>}
          <span className="text-sm text-muted">Inclusive of taxes</span>
        </div>

        {p.variants.length > 1 && (
          <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
            <legend className="mb-2.5 text-[15px] font-bold">
              {p.category === "kurtis" ? "Size" : "Colour"}: {v?.name}
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {p.variants.map((x, k) => (
                <button
                  key={x.id}
                  onClick={() => setVi(k)}
                  aria-pressed={k === vi}
                  aria-label={`${x.name}${x.stock <= 0 ? ", sold out" : ""}`}
                  className={`flex min-h-12 min-w-[84px] items-center justify-center gap-2 rounded-full bg-paper px-4 text-sm font-bold ${
                    k === vi ? "border-2 border-ink" : "border border-[#D9B8C4]"
                  } ${x.stock <= 0 ? "text-[#8C7380] line-through" : "text-ink"}`}
                >
                  {x.swatch && <span aria-hidden className="size-4 rounded-full border border-black/20" style={{ background: x.swatch }} />}
                  {x.name}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className={`flex items-center gap-2 text-[15px] font-bold ${toneClass[label.tone]}`} aria-live="polite">
          <span aria-hidden className="size-2 rounded-full bg-current" />
          {label.text}
        </div>

        {tryOnOptions(p).length > 0 && (
          <Link
            href={`/try-on/${p.slug}${v && tryOnOptions(p).some((o) => o.variantId === v.id) ? `?v=${v.id}` : ""}`}
            className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-full border-2 border-ink text-base font-bold text-ink no-underline"
          >
            <TryOnIcon size={20} /> Try it on with your camera
          </Link>
        )}

        {inStock ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5">
              <button onClick={() => addToCart(false)} className="min-h-[54px] flex-[1.3] cursor-pointer rounded-full border-0 bg-pink text-base font-bold text-white">
                {added ? "Added to cart" : "Add to cart"}
              </button>
              <button onClick={() => addToCart(true)} className="min-h-[54px] flex-1 cursor-pointer rounded-full border-2 border-ink bg-transparent text-base font-bold text-ink">
                Buy now
              </button>
            </div>
            <a
              href={waLink(waProductText(p.name, p.variants.length > 1 ? v!.name : null, p.price, pageUrl))}
              className="flex min-h-[50px] items-center justify-center rounded-full bg-ink text-[15px] font-bold text-cream no-underline"
            >
              Order on WhatsApp
            </a>
            {added && (
              <Link href="/cart" className="text-sm font-bold">
                View cart and checkout
              </Link>
            )}
          </div>
        ) : notify === "done" ? (
          <p className="m-0 rounded-2xl bg-[#E4F2EB] p-4 text-[15px] font-bold text-ok">We&apos;ll message you on WhatsApp when {v?.name} is back.</p>
        ) : (
          <form onSubmit={askRestock} className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-paper p-4">
            <label htmlFor="restock-phone" className="text-[15px] font-bold">
              Get a WhatsApp message when it&apos;s back
            </label>
            <div className="flex gap-2">
              <input
                id="restock-phone"
                inputMode="numeric"
                autoComplete="tel"
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="min-h-12 flex-1 rounded-xl border border-[#D9B8C4] bg-white px-3.5 text-base"
              />
              <button disabled={notify === "sending"} className="min-h-12 cursor-pointer whitespace-nowrap rounded-xl border-0 bg-maroon px-4 font-bold text-white">
                Notify me
              </button>
            </div>
            {notify === "error" && <p className="m-0 text-sm text-bad">That didn&apos;t go through. Please try again.</p>}
          </form>
        )}

        <TrustStrip compact />

        {p.description && (
          <details open className="border-b border-line pb-3">
            <summary className="flex min-h-11 cursor-pointer items-center text-base font-bold">Details</summary>
            <p className="m-0 mt-1 text-[15px] leading-relaxed text-[#4A2A36]">{p.description}</p>
          </details>
        )}
        {p.category !== "kurtis" && (
          <details className="border-b border-line pb-3">
            <summary className="flex min-h-11 cursor-pointer items-center text-base font-bold">Care</summary>
            <p className="m-0 mt-1 text-[15px] leading-relaxed text-[#4A2A36]">Keep away from perfume and water. Store in the zip pouch it comes in.</p>
          </details>
        )}
      </div>
    </div>
  );
}
