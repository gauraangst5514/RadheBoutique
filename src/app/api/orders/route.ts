import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderError, orderRequestSchema, priceCart } from "@/lib/orders";
import { razorpay, razorpayEnabled } from "@/lib/razorpay";
import { waLink } from "@/lib/whatsapp";
import { rupees } from "@/lib/pricing";
import { store } from "@/config/store";
import { siteUrl } from "@/lib/site";

export async function POST(req: Request) {
  const parsed = orderRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    // Field-level messages keyed by customer field name, for the checkout form.
    const issues: Record<string, string[]> = {};
    for (const i of parsed.error.issues) {
      const key = i.path[0] === "customer" ? String(i.path[1]) : String(i.path[0]);
      (issues[key] ??= []).push(i.message.startsWith("Too small") ? "Please fill this in" : i.message);
    }
    return NextResponse.json({ error: "Please check your details.", issues }, { status: 400 });
  }
  const { lines, method, customer } = parsed.data;

  try {
    const { items, totals } = await priceCart(lines, method);
    const base = {
      items,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      codFee: totals.codFee,
      total: totals.total,
      paymentMethod: method,
      customer: { ...customer, email: customer.email || undefined },
    };

    if (method === "razorpay") {
      if (!store.onlinePayments || !razorpayEnabled) return NextResponse.json({ error: "Online payment is coming soon. Please order on WhatsApp for now." }, { status: 503 });
      const rzp = await razorpay().orders.create({
        amount: Math.round(totals.total * 100),
        currency: "INR",
        receipt: `rb_${Date.now()}`,
        notes: { phone: customer.phone },
      });
      const order = await db.createOrder({ ...base, status: "pending_payment", stockApplied: false, razorpayOrderId: rzp.id });
      return NextResponse.json({
        orderId: order.id,
        razorpay: {
          key: process.env.RAZORPAY_KEY_ID,
          orderId: rzp.id,
          amount: rzp.amount,
          currency: "INR",
          name: store.name,
          prefill: { name: customer.name, contact: customer.phone, email: customer.email || undefined },
        },
      });
    }

    // Cash on delivery is switched off: the shop takes prepaid (Razorpay) or WhatsApp orders only.
    if (method === "cod") {
      return NextResponse.json({ error: "Cash on delivery isn't available. Please order on WhatsApp." }, { status: 400 });
    }

    // WhatsApp: record the order, the shop confirms it in chat and then marks it confirmed in admin.
    const order = await db.createOrder({ ...base, status: "whatsapp_pending", stockApplied: false });
    // Full product links, so WhatsApp shows the (first) product's photo as a preview card.
    const site = siteUrl(req);
    const slugs = new Map((await db.getProductsByIds(items.map((i) => i.productId))).map((p) => [p.id, p.slug]));
    const link = (id: string) => (site && slugs.get(id) ? `\n  ${site}/p/${slugs.get(id)}` : "");
    const text =
      `Hi Radhe Boutique! Order ${order.number}\n` +
      items.map((i) => `• ${i.name} (${i.variantName}) × ${i.qty} – ${rupees(i.unitPrice * i.qty)}${link(i.productId)}`).join("\n") +
      (totals.discount ? `\nCombo discount: −${rupees(totals.discount)}` : "") +
      `\nTotal: ${rupees(totals.total)}\n\n${customer.name}, ${customer.phone}\n${customer.address}, ${customer.city}, ${customer.state} ${customer.pincode}`;
    return NextResponse.json({ orderId: order.id, whatsappUrl: waLink(text) });
  } catch (e) {
    if (e instanceof OrderError) return NextResponse.json({ error: e.message, variantId: e.variantId }, { status: e.status });
    console.error("order failed", e);
    return NextResponse.json({ error: "We couldn't place the order. Please try again or order on WhatsApp." }, { status: 500 });
  }
}
