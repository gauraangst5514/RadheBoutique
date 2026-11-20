"use client";
import { useMemo, useState } from "react";
import type { Order } from "@/lib/types";
import { OrderCard } from "./OrderCard";

const TABS = [
  { id: "todo", label: "To do", match: ["needs_attention", "whatsapp_pending", "paid", "cod_confirmed", "confirmed"] },
  { id: "shipped", label: "Shipped", match: ["shipped"] },
  { id: "delivered", label: "Delivered", match: ["delivered"] },
  { id: "unpaid", label: "Unpaid", match: ["pending_payment"] },
  { id: "cancelled", label: "Cancelled", match: ["cancelled"] },
  { id: "all", label: "All", match: null },
] as const;

/** Orders with a search box (name, phone, order number, product) and status tabs with counts. */
export function OrdersBoard({ orders }: { orders: Order[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("todo");
  const [q, setQ] = useState("");

  const counts = useMemo(
    () => Object.fromEntries(TABS.map((t) => [t.id, t.match ? orders.filter((o) => (t.match as readonly string[]).includes(o.status)).length : orders.length])),
    [orders],
  );

  const shown = useMemo(() => {
    const t = TABS.find((x) => x.id === tab)!;
    const needle = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (t.match && !(t.match as readonly string[]).includes(o.status)) return false;
      if (!needle) return true;
      const hay = [o.number, o.customer.name, o.customer.phone, o.customer.city, o.customer.pincode, ...o.items.map((i) => i.name)].join(" ").toLowerCase();
      return hay.includes(needle);
    });
  }, [orders, tab, q]);

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name, phone, order no. or product"
        aria-label="Search orders"
        className="min-h-12 rounded-xl border border-[#D9B8C4] bg-white px-3.5 text-base"
      />
      <div role="tablist" aria-label="Order status" className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-sm font-bold ${tab === t.id ? "border-0 bg-ink text-cream" : "border border-[#E5CCD5] bg-paper text-ink"}`}
          >
            {t.label} <span className="opacity-70">{counts[t.id]}</span>
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="m-0 rounded-2xl border border-dashed border-line p-5 text-center text-muted">Nothing here{q ? ` for “${q}”` : ""}.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {shown.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
