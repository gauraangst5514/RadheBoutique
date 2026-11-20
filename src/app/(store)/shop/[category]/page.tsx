import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { categories, type CategorySlug } from "@/config/store";
import { ShopGrid } from "../ShopGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  if (!c) return { title: "Shop" };
  return {
    title: `${c.name} in Nashik – ${c.blurb}`,
    description: `Shop ${c.name.toLowerCase()} online at Radhe Boutique, Nashik. ${c.blurb}. Order on WhatsApp, free shipping across India on ₹299+.`,
    alternates: { canonical: `/shop/${c.slug}` },
    openGraph: { url: `/shop/${c.slug}`, title: `${c.name} | Radhe Boutique Nashik` },
  };
}

export default async function ShopCategory({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  if (!c) notFound();
  const products = await db.listProducts({ category: c.slug as CategorySlug });
  return <ShopGrid title={c.name} products={products} active={c.slug} />;
}
