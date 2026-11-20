"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order, OrderStatus } from "@/lib/types";
import { rupees } from "@/lib/pricing";

const statusText: Record<OrderStatus, { label: string; cls: string }> = {
  pending_payment: { label: "Waiting for payment", cls: "bg-[#EDE6E9] text-[#4A2A36]" },
  paid: { label: "Paid online · pack it", cls: "bg-[#E4F2EB] text-ok" },
  cod_confirmed: { label: "COD · pack it", cls: "bg-[#FDEBD9] text-[#7A3A06]" },
  whatsapp_pending: { label: "WhatsApp · confirm in chat", cls: "bg-blush text-maroon" },
  confirmed: { label: "Confirmed · pack it", cls: "bg-[#E4F2EB] text-ok" },
  shipped: { label: "Shipped", cls: "bg-[#E3E9F6] text-[#23407A]" },
  delivered: { label: "Delivered", cls: "bg-[#EDE6E9] text-[#4A2A36]" },
  cancelled: { label: "Cancelled", cls: "bg-[#EDE6E9] text-[#6E4A58]" },
  needs_attention: { label: "Needs attention", cls: "bg-[#FBE4E7] text-bad" },
};

export function OrderCard({ order: o }: { order: Order }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const s = statusText[o.status];

  async function act(action: "confirm" | "ship" | "deliver" | "cancel") {
    if (action === "cancel" && !confirm(`Cancel order ${o.number}?${o.stockApplied ? " Its stock goes back online." : ""}`)) return;
    setBusy(true);
    setErr(null);
    const r = await fetch(`/api/admin/orders/${o.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) setErr(d.error ?? "Didn't work");
    else router.refresh();
  }

  const btn = "min-h-11 cursor-pointer rounded-full px-4 text-sm font-bold disabled:opacity-50";
  const phone = o.customer.phone;

  return (
    <article className="flex flex-col gap-3 rounded-[20px] border border-line bg-paper p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold">{o.number}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>{s.label}</span>
      </div>
      <ul className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
        {o.items.map((i) => (
          <li key={i.variantId}>
            {i.qty} × {i.name} <span className="text-muted">({i.variantName})</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <span>
          <strong>{o.customer.name}</strong> · <a href={`tel:${phone}`}>{phone}</a> · {o.customer.city} {o.customer.pincode}
        </span>
        <span className="font-bold">{rupees(o.total)}</span>
      </div>
      <details className="text-sm text-[#4A2A36]">
        <summary className="cursor-pointer">Address</summary>
        <p className="m-0 mt-1">{o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pincode}</p>
      </details>
      {o.note && <p className="m-0 rounded-xl bg-[#FBE4E7] p-2.5 text-sm font-bold text-bad">{o.note}</p>}
      {err && <p className="m-0 text-sm font-bold text-bad">{err}</p>}
      <div className="flex flex-wrap gap-2">
        <a href={`https://wa.me/91${phone}`} className={`${btn} flex items-center bg-ink text-cream no-underline`}>WhatsApp</a>
        {o.status === "whatsapp_pending" && <button disabled={busy} onClick={() => act("confirm")} className={`${btn} border-0 bg-pink text-white`}>Confirm (takes stock)</button>}
        {["paid", "cod_confirmed", "confirmed", "needs_attention"].includes(o.status) && <button disabled={busy} onClick={() => act("ship")} className={`${btn} border-0 bg-pink text-white`}>Mark shipped</button>}
        {o.status === "shipped" && <button disabled={busy} onClick={() => act("deliver")} className={`${btn} border-0 bg-pink text-white`}>Mark delivered</button>}
        {!["cancelled", "delivered"].includes(o.status) && <button disabled={busy} onClick={() => act("cancel")} className={`${btn} border-2 border-ink bg-transparent text-ink`}>Cancel</button>}
      </div>
      <span className="text-xs text-muted">{new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {o.paymentMethod.toUpperCase()}</span>
    </article>
  );
}
