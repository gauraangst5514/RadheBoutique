import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { store } from "@/config/store";
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
    title: `${p.name} – ₹${p.price}`,
    description: `${p.name} for just ₹${p.price} at Radhe Boutique, Nashik. ${p.description}`.slice(0, 158),
    alternates: { canonical: `/p/${p.slug}` },
    openGraph: {
      url: `/p/${p.slug}`,
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
  const site = siteUrl(await headers());
  const inStock = p.variants.some((v) => v.stock > 0);
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description,
      image: p.images.map((i) => i.url),
      sku: p.variants[0]?.sku,
      category: categoryName(p.category),
      brand: { "@type": "Brand", name: store.name },
      offers: {
        "@type": "Offer",
        url: `${site}/p/${p.slug}`,
        priceCurrency: "INR",
        price: p.price,
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: store.name },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: { "@type": "MonetaryAmount", value: p.price >= store.shipping.freeAbove ? 0 : store.shipping.flatFee, currency: "INR" },
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Shop", item: `${site}/shop` },
        { "@type": "ListItem", position: 2, name: categoryName(p.category), item: `${site}/shop/${p.category}` },
        { "@type": "ListItem", position: 3, name: p.name, item: `${site}/p/${p.slug}` },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-4 md:px-6 md:pt-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/shop" className="text-muted">Shop</Link> / <Link href={`/shop/${p.category}`} className="text-muted">{categoryName(p.category)}</Link>
      </nav>
      <JsonLd data={ld} />
      <ProductClient product={p} siteUrl={site} />
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
