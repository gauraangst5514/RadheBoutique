import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  phone: z.string().regex(/^[6-9]\d{9}$/),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a 10-digit mobile number" }, { status: 400 });
  await db.addRestockRequest(parsed.data);
  return NextResponse.json({ ok: true });
}
