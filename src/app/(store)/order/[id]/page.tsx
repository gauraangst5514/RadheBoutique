import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { rupees } from "@/lib/pricing";
import { waLink } from "@/lib/whatsapp";
import type { OrderStatus } from "@/lib/types";
import { Confetti } from "@/components/motion/Confetti";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your order", robots: { index: false } };

const headline: Partial<Record<OrderStatus, string>> = {
  paid: "PAYMENT RECEIVED",
  cod_confirmed: "ORDER PLACED",
  whatsapp_pending: "ORDER SENT",
  confirmed: "ORDER CONFIRMED",
  shipped: "ON ITS WAY",
  delivered: "DELIVERED",
  pending_payment: "WAITING FOR PAYMENT",
  needs_attention: "WE'LL CALL YOU",
  cancelled: "ORDER CANCELLED",
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Order ids are random UUIDs, so the link itself works as the customer's private receipt.
  const o = await db.getOrder(id);
  if (!o) notFound();

  return (
    <div className="mx-auto max-w-[680px] px-5 pt-10">
      {["whatsapp_pending", "paid", "confirmed", "cod_confirmed"].includes(o.status) && <Confetti />}
      <span className="font-serif-italic text-xl text-maroon">Shukriya, {o.customer.name.split(" ")[0]}!</span>
      <h1 className="font-display m-0 mt-1 text-[48px] leading-none md:text-[64px]">{headline[o.status] ?? "YOUR ORDER"}</h1>
      <p className="mt-3 text-[15px] text-[#4A2A36]">
        Order <strong>{o.number}</strong>.{" "}
        {o.status === "cod_confirmed" && "Pay in cash when it arrives. We'll message you on WhatsApp when it ships."}
        {o.status === "paid" && "We'll message you on WhatsApp when it ships."}
        {o.status === "pending_payment" && "If money left your account, it will show here shortly. If not, you can try again from your cart."}
        {o.status === "needs_attention" && "Your payment came through, but a piece sold out at the same moment. We'll call you to swap it or refund you in full."}
      </p>

      <ul className="m-0 mt-6 flex list-none flex-col gap-2 rounded-[20px] border border-line bg-paper p-5 text-[15px]">
        {o.items.map((i) => (
          <li key={i.variantId} className="flex justify-between gap-3">
            <span>{i.name} <span className="text-muted">({i.variantName}) × {i.qty}</span></span>
            <span className="font-bold">{rupees(i.unitPrice * i.qty)}</span>
          </li>
        ))}
        {o.discount > 0 && (
          <li className="flex justify-between font-bold text-ok"><span>Combo discount</span><span>−{rupees(o.discount)}</span></li>
        )}
        <li className="mt-2 flex justify-between border-t border-line pt-3 text-lg font-bold"><span>Total</span><span>{rupees(o.total)}</span></li>
      </ul>

      <p className="mt-6 text-sm text-muted">
        Delivering to {o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pincode}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={waLink(`Hi! Question about my order ${o.number}`)} className="rounded-full bg-ink px-6 py-3.5 font-bold text-cream no-underline">
          Message us on WhatsApp
        </a>
        <Link href="/shop" className="rounded-full border-2 border-ink px-6 py-3 font-bold no-underline">Keep shopping</Link>
      </div>
    </div>
  );
}
