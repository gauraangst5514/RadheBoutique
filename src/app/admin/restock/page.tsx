import { requireAdminPage } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Restock() {
  await requireAdminPage();
  const [reqs, products] = await Promise.all([db.listRestockRequests(), db.listProducts({ includeInactive: true })]);
  const find = (pid: string, vid: string) => {
    const p = products.find((x) => x.id === pid);
    return { p, v: p?.variants.find((x) => x.id === vid) };
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display m-0 text-[40px] leading-none">RESTOCK ALERTS</h1>
      <p className="m-0 text-sm text-muted">People who asked to be told when a sold-out piece is back. Message them after you add stock.</p>
      {reqs.length === 0 && <p className="text-muted">No requests yet.</p>}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {reqs.map((r) => {
          const { p, v } = find(r.productId, r.variantId);
          const text = p ? `Hi! ${p.name}${v ? ` (${v.name})` : ""} is back in stock at Radhe Boutique: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/p/${p.slug}` : "Hi! Your item is back in stock.";
          return (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-paper p-3.5 text-sm">
              <span>
                <strong>{p?.name ?? "Removed product"}</strong> {v && <span className="text-muted">({v.name}, stock now {v.stock})</span>}
                <br />
                {r.phone} · {new Date(r.createdAt).toLocaleDateString("en-IN")}
              </span>
              <a href={`https://wa.me/91${r.phone}?text=${encodeURIComponent(text)}`} className="flex min-h-11 items-center rounded-full bg-ink px-4 font-bold text-cream no-underline">
                Send WhatsApp
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
