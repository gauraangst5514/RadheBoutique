import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { rupees } from "@/lib/pricing";
import { totalStock } from "@/lib/stock";
import { store } from "@/config/store";
import { OrdersBoard } from "./OrdersBoard";

export const dynamic = "force-dynamic";

/** Statuses that count as a real sale (money taken or order agreed). */
const SOLD = ["paid", "confirmed", "shipped", "delivered", "cod_confirmed"];
const TODO = ["needs_attention", "whatsapp_pending", "paid", "cod_confirmed", "confirmed"];

export default async function AdminHome() {
  await requireAdminPage();
  const [orders, products, restock] = await Promise.all([
    db.listOrders(500),
    db.listProducts({ includeInactive: true }),
    db.listRestockRequests(),
  ]);

  // Day boundaries in India time.
  const ist = (d: Date) => new Date(d.getTime() + 330 * 60_000).toISOString().slice(0, 10);
  const today = ist(new Date());
  const month = today.slice(0, 7);
  const sold = orders.filter((o) => SOLD.includes(o.status));
  const sum = (list: typeof orders) => list.reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter((o) => ist(new Date(o.createdAt)) === today && o.status !== "cancelled");
  const monthSold = sold.filter((o) => ist(new Date(o.createdAt)).startsWith(month));
  const todo = orders.filter((o) => TODO.includes(o.status));
  const live = products.filter((p) => p.active);
  const soldOut = live.filter((p) => totalStock(p) === 0);
  const low = live.filter((p) => totalStock(p) > 0 && totalStock(p) <= store.lowStockAt);

  const tiles = [
    { label: "To confirm or pack", value: String(todo.length), tone: todo.length ? "bg-pink text-white" : "bg-paper", href: "#orders" },
    { label: "Orders today", value: String(todayOrders.length), sub: rupees(sum(todayOrders)), tone: "bg-paper" },
    { label: "Sales this month", value: rupees(sum(monthSold)), sub: `${monthSold.length} orders`, tone: "bg-paper" },
    { label: "Products live", value: String(live.length), sub: `${products.length - live.length} hidden`, tone: "bg-paper", href: "/admin/products" },
    { label: "Sold out / low", value: `${soldOut.length} / ${low.length}`, sub: "restock these", tone: soldOut.length ? "bg-[#FBE4E7]" : "bg-paper", href: "/admin/products?filter=attention" },
    { label: "Restock requests", value: String(restock.length), sub: "people waiting", tone: "bg-paper", href: "/admin/restock" },
  ];

  return (
    <div className="flex flex-col gap-7">
      <section className="flex flex-col gap-3">
        <h1 className="font-display m-0 text-[40px] leading-none">TODAY</h1>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {tiles.map((t) => {
            const body = (
              <>
                <span className="text-xs font-bold uppercase tracking-wider opacity-75">{t.label}</span>
                <span className="font-display text-[30px] leading-none md:text-[36px]">{t.value}</span>
                {t.sub && <span className="text-xs font-bold opacity-75">{t.sub}</span>}
              </>
            );
            const cls = `flex flex-col gap-1.5 rounded-2xl border border-line p-3.5 no-underline ${t.tone}`;
            return t.href ? (
              <Link key={t.label} href={t.href} className={`${cls} transition-transform hover:-translate-y-0.5`}>
                {body}
              </Link>
            ) : (
              <div key={t.label} className={cls}>
                {body}
              </div>
            );
          })}
        </div>
      </section>

      <section id="orders" className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="font-display m-0 text-[36px] leading-none">ORDERS</h2>
          <a href="/api/admin/orders/export" download className="rounded-full border-2 border-ink px-4 py-2 text-sm font-bold text-ink no-underline">
            Download all (Excel/CSV)
          </a>
        </div>
        {orders.length === 0 ? (
          <p className="text-muted">No orders yet. They&apos;ll appear here as soon as someone checks out.</p>
        ) : (
          <OrdersBoard orders={orders} />
        )}
      </section>
    </div>
  );
}
