"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { ProductImg } from "@/components/ProductImg";

export function EditProduct({ product: p }: { product: Product }) {
  const router = useRouter();
  const [name, setName] = useState(p.name);
  const [description, setDescription] = useState(p.description);
  const [copied, setCopied] = useState(false);
  const [price, setPrice] = useState(String(p.price));
  const [mrp, setMrp] = useState(p.mrp ? String(p.mrp) : "");
  const [active, setActive] = useState(p.active);
  const [featured, setFeatured] = useState(p.featured);
  const [stock, setStock] = useState(Object.fromEntries(p.variants.map((v) => [v.id, v.stock])));
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    setMsg(null);
    const r = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        mrp: mrp ? Number(mrp) : null,
        active,
        featured,
        variants: Object.entries(stock).map(([id, s]) => ({ id, stock: s })),
      }),
    });
    setBusy(false);
    setMsg(r.ok ? "Saved" : "Couldn't save. Check the name (2+ letters) and price.");
    if (r.ok) router.refresh();
  }

  const input = "min-h-12 w-full rounded-xl border border-[#D9B8C4] bg-white px-3.5 text-[17px] font-bold";

  return (
    <div className="flex flex-col gap-5">
      <Link href="/admin/products" className="text-sm font-bold">← All products</Link>
      <div className="flex items-center gap-3">
        <span className="size-20 shrink-0 overflow-hidden rounded-2xl bg-[#F3E7DF]"><ProductImg p={p} className="size-full object-cover" /></span>
        <div className="flex flex-col">
          <h1 className="m-0 text-xl font-bold">{p.name}</h1>
          <span className="flex flex-wrap gap-3 text-sm">
            <Link href={`/p/${p.slug}`} target="_blank">View on site ↗</Link>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`${window.location.origin}/p/${p.slug}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); });
              }}
              className="cursor-pointer border-0 bg-transparent p-0 font-bold text-pink underline"
            >
              {copied ? "Link copied ✓" : "Copy link"}
            </button>
          </span>
        </div>
      </div>

      <label className="flex flex-col gap-1.5"><span className="text-sm font-bold">Name</span><input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className={input} /></label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-bold">Description</span>
        <textarea value={description} maxLength={800} rows={4} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-[#D9B8C4] bg-white p-3.5 text-[15px] leading-relaxed" />
        <span className="text-xs text-muted">{description.length}/800 · shown on the product page and on Google</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5"><span className="text-sm font-bold">Offer price (₹)</span><input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} className={input} /></label>
        <label className="flex flex-col gap-1.5"><span className="text-sm font-bold">MRP (₹, optional)</span><input inputMode="numeric" value={mrp} onChange={(e) => setMrp(e.target.value.replace(/\D/g, ""))} className={input} /></label>
      </div>

      <section className="flex flex-col gap-2.5">
        <h2 className="m-0 text-base font-bold">Online stock</h2>
        {p.variants.map((v) => (
          <div key={v.id} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-2.5">
            {v.swatch && <span aria-hidden className="size-5 rounded-full border border-black/20" style={{ background: v.swatch }} />}
            <span className="flex flex-1 flex-col"><span className="font-bold">{v.name}</span><span className="text-xs text-muted">{v.sku}</span></span>
            <button aria-label={`Remove one ${v.name}`} onClick={() => setStock({ ...stock, [v.id]: Math.max(0, stock[v.id] - 1) })} className="size-11 cursor-pointer rounded-full border border-[#D9B8C4] bg-white text-xl font-bold">−</button>
            <span className="w-8 text-center text-lg font-bold">{stock[v.id]}</span>
            <button aria-label={`Add one ${v.name}`} onClick={() => setStock({ ...stock, [v.id]: stock[v.id] + 1 })} className="size-11 cursor-pointer rounded-full border-0 bg-ink text-xl font-bold text-white">+</button>
          </div>
        ))}
      </section>

      <label className="flex min-h-12 items-center gap-3 font-bold"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="size-5 accent-pink" /> Show on website</label>
      <label className="flex min-h-12 items-center gap-3 font-bold"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-5 accent-pink" /> Feature on homepage</label>

      <button onClick={save} disabled={busy} className="min-h-[54px] cursor-pointer rounded-full border-0 bg-pink text-base font-bold text-white disabled:opacity-60">
        {busy ? "Saving…" : "Save changes"}
      </button>
      {msg && <p role="status" className="m-0 font-bold">{msg}</p>}
    </div>
  );
}
