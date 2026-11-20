import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { finalizePaid, verifyRazorpaySignature } from "@/lib/orders";

const schema = z.object({
  orderId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const b = parsed.data;
  const order = await db.getOrder(b.orderId);
  if (!order || order.razorpayOrderId !== b.razorpay_order_id) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (!verifyRazorpaySignature(b.razorpay_order_id, b.razorpay_payment_id, b.razorpay_signature)) {
    return NextResponse.json({ error: "Payment could not be verified" }, { status: 400 });
  }
  const updated = await finalizePaid(order, b.razorpay_payment_id);
  return NextResponse.json({ orderId: order.id, status: updated?.status });
}
