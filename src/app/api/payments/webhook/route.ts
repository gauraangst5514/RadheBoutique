import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { finalizePaid, verifyWebhookSignature } from "@/lib/orders";

/**
 * Razorpay webhook (backup for when the customer closes the tab before we verify).
 * Dashboard → Settings → Webhooks → URL: https://<your-domain>/api/payments/webhook
 * Events: payment.captured, order.paid. Secret: RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, sig)) return NextResponse.json({ error: "bad signature" }, { status: 400 });

  const event = JSON.parse(raw);
  const payment = event?.payload?.payment?.entity;
  const rzpOrderId: string | undefined = payment?.order_id ?? event?.payload?.order?.entity?.id;
  if ((event.event === "payment.captured" || event.event === "order.paid") && rzpOrderId && payment?.id) {
    const order = await db.getOrderByRazorpayId(rzpOrderId);
    if (order) await finalizePaid(order, payment.id);
  }
  return NextResponse.json({ ok: true });
}
