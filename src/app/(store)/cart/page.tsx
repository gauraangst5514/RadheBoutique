"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { computeTotals, rupees } from "@/lib/pricing";
import { TrashIcon } from "@/components/icons";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-[50vh]" />;

  const totals = computeTotals(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[640px] flex-col items-start gap-4 px-5 pt-14">
        <h1 className="font-display m-0 text-[48px] leading-none md:text-[64px]">YOUR CART IS EMPTY</h1>
        <p className="m-0 text-muted">Kuch toh le lo! Start with our Instagram favourites.</p>
        <Link href="/shop" className="rounded-full bg-pink px-6 py-3.5 font-bold text-white no-underline">Shop now</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1100px] gap-8 px-4 pt-6 md:grid-cols-[1fr_360px] md:px-6 md:pt-10">
      <div>
        <h1 className="font-display m-0 mb-5 text-[44px] leading-none md:text-[64px]">YOUR CART</h1>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {items.map((i) => (
            <li key={i.variantId} className="flex gap-3 rounded-[20px] border border-line bg-paper p-3">
              <Link href={`/p/${i.slug}`} className="size-[84px] shrink-0 overflow-hidden rounded-2xl bg-[#F3E7DF]">
                {i.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={i.image} alt="" className="size-full object-cover" />
                ) : (
                  <span className="placeholder-stripes block size-full" />
                )}
              </Link>
              <div className="flex flex-1 flex-col gap-1">
                <Link href={`/p/${i.slug}`} className="text-[15px] font-bold leading-tight no-underline">{i.name}</Link>
                <span className="text-sm text-muted">{i.variantName}</span>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1" role="group" aria-label={`Quantity of ${i.name}`}>
                    <button aria-label="One less" onClick={() => setQty(i.variantId, i.qty - 1)} className="size-10 rounded-full border border-[#D9B8C4] bg-white text-lg font-bold">−</button>
                    <span className="w-7 text-center font-bold">{i.qty}</span>
                    <button aria-label="One more" disabled={i.qty >= i.maxQty} onClick={() => setQty(i.variantId, i.qty + 1)} className="size-10 rounded-full border-0 bg-ink text-lg font-bold text-white disabled:opacity-40">+</button>
                  </div>
                  <span className="font-bold">{rupees(i.unitPrice * i.qty)}</span>
                </div>
              </div>
              <button aria-label={`Remove ${i.name}`} onClick={() => remove(i.variantId)} className="flex size-10 items-center justify-center self-start rounded-full text-muted">
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <aside className="flex h-fit flex-col gap-3 rounded-[24px] border border-line bg-paper p-5 md:sticky md:top-6 md:mt-[84px]">
        <Row label="Subtotal" value={rupees(totals.subtotal)} />
        {totals.discount > 0 && <Row label="Combo discount" value={`−${rupees(totals.discount)}`} accent />}
        {totals.bundleNotes.map((n) => (
          <p key={n} className="m-0 rounded-xl bg-[#FDEBD9] px-3 py-2 text-sm font-bold text-[#7A3A06]">{n}</p>
        ))}
        <Row label="Shipping" value={totals.shipping ? rupees(totals.shipping) : "Free"} />
        <div className="border-t border-line pt-3">
          <Row label="Total" value={rupees(totals.total)} big />
        </div>
        <Link href="/checkout" className="mt-1 flex min-h-[54px] items-center justify-center rounded-full bg-pink text-base font-bold text-white no-underline">
          Checkout
        </Link>
        <p className="m-0 text-center text-xs text-muted">UPI, cards or WhatsApp</p>
      </aside>
    </div>
  );
}

function Row({ label, value, big, accent }: { label: string; value: string; big?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between ${big ? "text-lg font-bold" : "text-[15px]"} ${accent ? "font-bold text-ok" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
