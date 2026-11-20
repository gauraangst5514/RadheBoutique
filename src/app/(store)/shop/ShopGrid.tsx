import Link from "next/link";
import { categories } from "@/config/store";
import { ProductCard } from "@/components/ProductCard";
import { InStoreOnly } from "@/components/InStoreOnly";
import { PageBanner } from "@/components/motion/PageBanner";
import type { Product } from "@/lib/types";

export function ShopGrid({ title, products, active }: { title: string; products: Product[]; active?: string }) {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pt-6 md:px-6 md:pt-10">
      <PageBanner
        title={title}
        eyebrow={categories.find((c) => c.slug === active)?.blurb ?? "Radhe Boutique, Nashik"}
        line={products.length ? `${products.length} styles · from ₹${Math.min(...products.map((p) => p.price))}` : undefined}
      />
      <nav aria-label="Categories" className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
        <Link href="/shop" className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold no-underline ${!active ? "bg-ink text-cream" : "border border-[#E5CCD5] bg-paper"}`}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            aria-current={active === c.slug ? "page" : undefined}
            className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold no-underline ${active === c.slug ? "bg-ink text-cream" : "border border-[#E5CCD5] bg-paper"}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>
      {products.length === 0 ? (
        <InStoreOnly name={active ? title : "pieces"} />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-[22px]">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
