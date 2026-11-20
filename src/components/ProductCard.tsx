import Link from "next/link";
import type { Product } from "@/lib/types";
import { rupees } from "@/lib/pricing";
import { lowestStockBadge } from "@/lib/stock";
import { ProductImg } from "@/components/ProductImg";
import { canTryOn } from "@/lib/tryon";

export function ProductCard({ p }: { p: Product }) {
  const badge = lowestStockBadge(p);
  const colours = p.variants.length;
  return (
    <article data-reveal className="pc group flex flex-col gap-2 md:gap-3">
      <Link href={`/p/${p.slug}`} className="pc-img relative block aspect-square overflow-hidden rounded-[18px] bg-[#F3E7DF] md:rounded-[22px]">
        <ProductImg p={p} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {badge ? (
          <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold md:left-3 md:top-3 md:text-xs ${badge === "Sold out" ? "bg-ink text-white" : "bg-maroon text-white"}`}>
            {badge}
          </span>
        ) : canTryOn(p) ? (
          <span className="absolute left-2 top-2 rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold md:left-3 md:top-3 md:text-xs">Try-on ready</span>
        ) : p.tags[0] ? (
          <span className="absolute left-2 top-2 rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold md:left-3 md:top-3 md:text-xs">{p.tags[0]}</span>
        ) : null}
      </Link>
      <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-3">
        <Link href={`/p/${p.slug}`} className="text-sm font-bold leading-tight no-underline md:text-[17px]">
          {p.name}
        </Link>
        <span className="text-base font-bold text-pink md:text-lg">{rupees(p.price)}</span>
      </div>
      {colours > 1 && <span className="text-xs text-muted md:text-sm">{colours} options</span>}
    </article>
  );
}
