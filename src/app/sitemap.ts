import type { MetadataRoute } from "next";
import { categories, store } from "@/config/store";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Every live page Google should know about: home, shop, categories with stock, each product, help. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || store.siteUrl).replace(/\/+$/, "");
  const products = await db.listProducts().catch(() => []);
  const now = new Date();
  const live = categories.filter((c) => products.some((p) => p.category === c.slug));
  return [
    { url: `${site}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...live.map((c) => ({ url: `${site}/shop/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...products.map((p) => ({
      url: `${site}/p/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: p.images.slice(0, 3).map((i) => i.url),
    })),
    { url: `${site}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];
}
