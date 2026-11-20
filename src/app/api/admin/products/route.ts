import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { db, slugify } from "@/lib/db";
import { categories } from "@/config/store";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.enum(categories.map((c) => c.slug) as [string, ...string[]]),
  price: z.number().min(1).max(100000),
  mrp: z.number().min(0).max(100000).nullable().optional(),
  description: z.string().trim().max(800).default(""),
  tags: z.array(z.string().trim().min(1).max(30)).max(5).default([]),
  images: z.array(z.object({ url: z.string().min(1), kind: z.enum(["photo", "cutout", "lifestyle"]), alt: z.string().optional() })).max(10),
  variants: z
    .array(z.object({ name: z.string().trim().min(1).max(30), swatch: z.string().nullable().optional(), stock: z.number().int().min(0).max(9999) }))
    .min(1)
    .max(20),
  tryOn: z.enum(["earrings", "necklace"]).nullable(),
  tryOnImage: z.string().min(1).nullable().optional(),
  featured: z.boolean().default(false),
});

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Please log in again" }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the form", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  const d = parsed.data;
  const slug = slugify(d.name) || `item-${Date.now()}`;
  const codeBase = `RB-${d.category.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const product = await db.createProduct({
    name: d.name,
    slug,
    category: d.category as (typeof categories)[number]["slug"],
    price: d.price,
    mrp: d.mrp ?? null,
    description: d.description,
    tags: d.tags,
    images: d.images.map((i) => ({ ...i, alt: i.alt ?? d.name })),
    variants: d.variants.map((v, i) => ({
      name: v.name,
      swatch: v.swatch ?? null,
      stock: v.stock,
      sku: `${codeBase}-${String(i + 1).padStart(2, "0")}`,
    })),
    tryOn: d.tryOn,
    tryOnImage: d.tryOn ? (d.tryOnImage ?? null) : null,
    featured: d.featured,
  });
  return NextResponse.json({ product });
}
