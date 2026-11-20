import { requireAdminPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { OrderCard } from "./OrderCard";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdminPage();
  const orders = await db.listOrders(150);
  const todo = orders.filter((o) => ["needs_attention", "whatsapp_pending", "paid", "cod_confirmed", "confirmed"].includes(o.status));
  const done = orders.filter((o) => !todo.includes(o));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <h1 className="font-display m-0 text-[40px] leading-none">ORDERS</h1>
        <span className="text-sm font-bold text-muted">{todo.length} to pack or confirm</span>
      </div>
      {orders.length === 0 && <p className="text-muted">No orders yet. They&apos;ll appear here as soon as someone checks out.</p>}
      <div className="flex flex-col gap-3">
        {todo.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
      {done.length > 0 && (
        <details>
          <summary className="cursor-pointer py-2 font-bold">Shipped, delivered and cancelled ({done.length})</summary>
          <div className="mt-3 flex flex-col gap-3">
            {done.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
