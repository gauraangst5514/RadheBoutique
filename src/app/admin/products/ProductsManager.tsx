"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { categories, categoryName, store } from "@/config/store";
import { rupees } from "@/lib/pricing";
import { totalStock } from "@/lib/stock";
import { ProductImg } from "@/components/ProductImg";

type Filter = "all" | "live" | "hidden" | "featured" | "attention";
type Sort = "newest" | "name" | "price-low" | "price-high" | "stock-low";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "hidden", label: "Hidden" },
  { id: "featured", label: "On homepage" },
  { id: "attention", label: "Sold out / low" },
];

/**
 * The family's product list: counts, search, filters, sorting, a live/hidden switch and
 * "homepage" star on every row, and bulk actions for many products at once.
 */
export function ProductsManager({ products, initialFilter }: { products: Product[]; initialFilter: Filter }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [sort, setSort] = useState<Sort>("newest");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  // Optimistic overrides so switches respond instantly.
  const [local, setLocal] = useState<Record<string, Partial<Pick<Product, "active" | "featured">>>>({});

  const list = useMemo(() => products.map((p) => ({ ...p, ...local[p.id] })), [products, local]);

  const is = (p: Product, f: Filter) => {
    const s = totalStock(p);
    if (f === "live") return p.active;
    if (f === "hidden") return !p.active;
    if (f === "featured") return p.featured;
    if (f === "attention") return p.active && s <= store.lowStockAt;
    return true;
  };

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const out = list.filter(
      (p) =>
        (cat === "all" || p.category === cat) &&
        is(p, filter) &&
        (!needle || `${p.name} ${p.variants.map((v) => v.sku).join(" ")} ${p.tags.join(" ")}`.toLowerCase().includes(needle)),
    );
    const by: Record<Sort, (a: Product, b: Product) => number> = {
      newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
      name: (a, b) => a.name.localeCompare(b.name),
      "price-low": (a, b) => a.price - b.price,
      "price-high": (a, b) => b.price - a.price,
      "stock-low": (a, b) => totalStock(a) - totalStock(b),
    };
    return [...out].sort(by[sort]);
  }, [list, q, cat, filter, sort]);

  const counts = {
    total: list.length,
    live: list.filter((p) => p.active).length,
    hidden: list.filter((p) => !p.active).length,
    featured: list.filter((p) => p.featured).length,
    attention: list.filter((p) => is(p, "attention")).length,
    units: list.filter((p) => p.active).reduce((s, p) => s + totalStock(p), 0),
  };
  const perCat = (slug: string) => list.filter((p) => p.category === slug).length;

  async function patch(ids: string[], body: Partial<Pick<Product, "active" | "featured">>) {
    setBusy(true);
    setMsg(null);
    setLocal((l) => ({ ...l, ...Object.fromEntries(ids.map((id) => [id, { ...l[id], ...body }])) }));
    let failed = 0;
    // A few at a time, so 50 products don't hit the server all at once.
    for (let i = 0; i < ids.length; i += 8) {
      const res = await Promise.all(
        ids.slice(i, i + 8).map((id) =>
          fetch(`/api/admin/products/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }).then((r) => r.ok),
        ),
      );
      failed += res.filter((ok) => !ok).length;
    }
    setBusy(false);
    setMsg(failed ? `${failed} didn't save. Please try again.` : `Saved ${ids.length} product${ids.length > 1 ? "s" : ""}.`);
    router.refresh();
  }

  const allShownPicked = shown.length > 0 && shown.every((p) => picked.has(p.id));
  const togglePick = (id: string) => setPicked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const pickAllShown = () => setPicked((s) => { const n = new Set(s); if (allShownPicked) shown.forEach((p) => n.delete(p.id)); else shown.forEach((p) => n.add(p.id)); return n; });
  const bulk = (body: Partial<Pick<Product, "active" | "featured">>) => { const ids = [...picked]; if (ids.length) patch(ids, body).then(() => setPicked(new Set())); };

  return (
    <div className="flex flex-col gap-3">
      {/* counts */}
      <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
        {[
          ["Total", counts.total],
          ["Live", counts.live],
          ["Hidden", counts.hidden],
          ["On homepage", counts.featured],
          ["Pieces in stock", counts.units],
        ].map(([l, n]) => (
          <div key={l} className="flex flex-col rounded-2xl border border-line bg-paper px-3 py-2.5">
            <span className="font-display text-[28px] leading-none">{n}</span>
            <span className="text-xs font-bold text-muted">{l}</span>
          </div>
        ))}
      </div>

      {/* controls */}
      <div className="flex flex-col gap-2 md:flex-row">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or SKU"
          aria-label="Search products"
          className="min-h-12 flex-1 rounded-xl border border-[#D9B8C4] bg-white px-3.5 text-base"
        />
        <div className="flex gap-2">
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category" className="min-h-12 flex-1 rounded-xl border border-[#D9B8C4] bg-white px-3 text-[15px] md:flex-none">
            <option value="all">All categories ({counts.total})</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({perCat(c.slug)})
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort" className="min-h-12 flex-1 rounded-xl border border-[#D9B8C4] bg-white px-3 text-[15px] md:flex-none">
            <option value="newest">Newest</option>
            <option value="name">Name A–Z</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="stock-low">Stock: lowest first</option>
          </select>
        </div>
      </div>
      <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-sm font-bold ${filter === f.id ? "border-0 bg-ink text-cream" : "border border-[#E5CCD5] bg-paper text-ink"}`}
          >
            {f.label}{" "}
            <span className="opacity-70">
              {f.id === "all" ? counts.total : f.id === "live" ? counts.live : f.id === "hidden" ? counts.hidden : f.id === "featured" ? counts.featured : counts.attention}
            </span>
          </button>
        ))}
      </div>

      {/* bulk bar */}
      <div className="sticky top-[60px] z-10 flex flex-wrap items-center gap-2 rounded-2xl bg-ink px-3 py-2.5 text-cream md:top-[64px]">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={allShownPicked} onChange={pickAllShown} className="size-5 accent-pink" />
          {picked.size ? `${picked.size} selected` : `Select all ${shown.length} shown`}
        </label>
        {picked.size > 0 && (
          <div className="ml-auto flex flex-wrap gap-1.5">
            {[
              ["Show", { active: true }],
              ["Hide", { active: false }],
              ["★ Homepage", { featured: true }],
              ["Remove ★", { featured: false }],
            ].map(([l, body]) => (
              <button key={l as string} disabled={busy} onClick={() => bulk(body as Partial<Product>)} className="cursor-pointer rounded-full border-0 bg-cream px-3 py-1.5 text-[13px] font-bold text-ink disabled:opacity-50">
                {l as string}
              </button>
            ))}
            <button onClick={() => setPicked(new Set())} className="cursor-pointer rounded-full border border-cream/40 bg-transparent px-3 py-1.5 text-[13px] font-bold text-cream">
              Clear
            </button>
          </div>
        )}
      </div>
      {msg && <p role="status" className="m-0 text-sm font-bold text-ok">{msg}</p>}

      <p className="m-0 text-sm text-muted">
        Showing {shown.length} of {counts.total} products
      </p>

      {/* rows */}
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {shown.map((p) => {
          const stock = totalStock(p);
          return (
            <li key={p.id} className={`flex items-center gap-2.5 rounded-2xl border bg-paper p-2.5 ${picked.has(p.id) ? "border-pink" : "border-line"} ${p.active ? "" : "opacity-70"}`}>
              <input type="checkbox" checked={picked.has(p.id)} onChange={() => togglePick(p.id)} aria-label={`Select ${p.name}`} className="size-5 shrink-0 accent-pink" />
              <Link href={`/admin/products/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3 no-underline">
                <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-[#F3E7DF]">
                  <ProductImg p={p} className="size-full object-cover" />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-bold">{p.name}</span>
                  <span className="text-sm text-muted">
                    {categoryName(p.category)} · {rupees(p.price)}
                  </span>
                  <span className={`mt-0.5 self-start rounded-full px-2 py-0.5 text-[11px] font-bold ${stock === 0 ? "bg-[#FBE4E7] text-bad" : stock <= store.lowStockAt ? "bg-[#FDEBD9] text-[#7A3A06]" : "bg-[#E4F2EB] text-ok"}`}>
                    {stock === 0 ? "Sold out" : `${stock} in stock`}
                  </span>
                </span>
              </Link>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <button
                  onClick={() => patch([p.id], { active: !p.active })}
                  disabled={busy}
                  role="switch"
                  aria-checked={p.active}
                  aria-label={`${p.name} is ${p.active ? "live" : "hidden"}`}
                  className={`flex h-7 w-[74px] cursor-pointer items-center rounded-full border-0 px-1 text-[11px] font-bold transition-colors ${p.active ? "justify-end bg-ok text-white" : "justify-start bg-[#D9C9CF] text-ink"}`}
                >
                  {p.active ? <>LIVE <span className="ml-1 size-5 rounded-full bg-white" /></> : <><span className="mr-1 size-5 rounded-full bg-white" /> HIDDEN</>}
                </button>
                <button
                  onClick={() => patch([p.id], { featured: !p.featured })}
                  disabled={busy}
                  aria-pressed={p.featured}
                  title="Show on the homepage"
                  className={`cursor-pointer rounded-full border-0 px-2 py-0.5 text-[12px] font-bold ${p.featured ? "bg-gold text-maroon" : "bg-transparent text-muted"}`}
                >
                  {p.featured ? "★ Homepage" : "☆ Homepage"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
