import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/site";
import Link from "next/link";
import { db } from "@/lib/db";
import { categoryName } from "@/config/store";
import { ProductCard } from "@/components/ProductCard";
import { pickImage } from "@/components/ProductImg";
import { ProductClient } from "./ProductClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await db.getProductBySlug(slug);
  if (!p) return { title: "Not found" };
  const img = pickImage(p);
  return {
    title: p.name,
    description: `${p.name} for ₹${p.price}. ${p.description}`.slice(0, 160),
    openGraph: {
      title: `${p.name} – ₹${p.price}`,
      description: p.description.slice(0, 160),
      type: "website",
      images: img ? [{ url: img.url, alt: p.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await db.getProductBySlug(slug);
  if (!p || !p.active) notFound();
  const related = (await db.listProducts({ category: p.category })).filter((x) => x.id !== p.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-4 md:px-6 md:pt-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/shop" className="text-muted">Shop</Link> / <Link href={`/shop/${p.category}`} className="text-muted">{categoryName(p.category)}</Link>
      </nav>
      <ProductClient product={p} siteUrl={siteUrl(await headers())} />
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display m-0 mb-5 text-[34px] leading-none md:text-[48px]">COMPLETE THE LOOK</h2>
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-[22px]">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
