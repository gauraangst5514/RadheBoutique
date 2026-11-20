import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  price: z.number().min(1).max(100000).optional(),
  mrp: z.number().min(0).max(100000).nullable().optional(),
  description: z.string().trim().max(800).optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  variants: z.array(z.object({ id: z.string().min(1), stock: z.number().int().min(0).max(9999) })).optional(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Please log in again" }, { status: 401 });
  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the form" }, { status: 400 });
  const product = await db.updateProduct(id, parsed.data);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}
