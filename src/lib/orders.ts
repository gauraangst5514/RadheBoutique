import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { computeTotals } from "@/lib/pricing";
import type { Order, OrderItem, PaymentMethod } from "@/lib/types";
import { pickImage } from "@/components/ProductImg";

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  email: z.union([z.literal(""), z.string().trim().email()]).optional(),
  address: z.string().trim().min(8).max(300),
  city: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(60),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
});

export const orderRequestSchema = z.object({
  lines: z
    .array(z.object({ productId: z.string().min(1), variantId: z.string().min(1), qty: z.number().int().min(1).max(20) }))
    .min(1)
    .max(30),
  method: z.enum(["razorpay", "cod", "whatsapp"]),
  customer: customerSchema,
});

export type OrderRequest = z.infer<typeof orderRequestSchema>;

export class OrderError extends Error {
  constructor(message: string, public status = 400, public variantId?: string) {
    super(message);
  }
}

/** Re-price the cart from the database. Never trust prices sent by the browser. */
export async function priceCart(lines: OrderRequest["lines"], method: PaymentMethod) {
  const merged = new Map<string, OrderRequest["lines"][number]>();
  for (const l of lines) {
    const prev = merged.get(l.variantId);
    merged.set(l.variantId, prev ? { ...prev, qty: prev.qty + l.qty } : { ...l });
  }
  const products = await db.getProductsByIds([...new Set([...merged.values()].map((l) => l.productId))]);
  const items: OrderItem[] = [];
  for (const l of merged.values()) {
    const p = products.find((x) => x.id === l.productId);
    const v = p?.variants.find((x) => x.id === l.variantId);
    if (!p || !v || !p.active) throw new OrderError("Something in your cart is no longer available.", 409, l.variantId);
    if (v.stock < l.qty) {
      throw new OrderError(
        v.stock === 0 ? `${p.name} (${v.name}) just sold out.` : `Only ${v.stock} left of ${p.name} (${v.name}).`,
        409,
        v.id,
      );
    }
    items.push({
      productId: p.id,
      variantId: v.id,
      name: p.name,
      variantName: v.name,
      category: p.category,
      unitPrice: p.price,
      qty: l.qty,
      image: pickImage(p)?.url ?? null,
    });
  }
  const totals = computeTotals(items, method);
  return { items, totals };
}

export function stockLines(o: Pick<Order, "items">) {
  return o.items.map((i) => ({ variantId: i.variantId, qty: i.qty }));
}

/** Mark a Razorpay order as paid and take the stock. Safe to call twice (verify + webhook). */
export async function finalizePaid(order: Order, paymentId: string) {
  if (order.status === "paid" || order.stockApplied) return order;
  const res = await db.takeStock(stockLines(order));
  if (res.ok) {
    return db.updateOrder(order.id, { status: "paid", razorpayPaymentId: paymentId, stockApplied: true });
  }
  return db.updateOrder(order.id, {
    status: "needs_attention",
    razorpayPaymentId: paymentId,
    note: "Paid, but stock ran out before payment finished. Call the customer, then refund or offer a swap.",
  });
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqual(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}

function safeEqual(a: string, b: string) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}
