import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { categories, type CategorySlug } from "@/config/store";
import { ShopGrid } from "../ShopGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  return { title: c ? c.name : "Shop" };
}

export default async function ShopCategory({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = categories.find((x) => x.slug === category);
  if (!c) notFound();
  const products = await db.listProducts({ category: c.slug as CategorySlug });
  return <ShopGrid title={c.name} products={products} active={c.slug} />;
}
