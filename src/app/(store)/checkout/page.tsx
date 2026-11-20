"use client";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { computeTotals, rupees } from "@/lib/pricing";
import type { PaymentMethod } from "@/lib/types";

const STATES = [
  "Maharashtra", "Gujarat", "Karnataka", "Madhya Pradesh", "Delhi", "Goa", "Rajasthan", "Telangana", "Tamil Nadu", "Uttar Pradesh",
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand",
  "Kerala", "Odisha", "Puducherry", "Punjab", "Uttarakhand", "West Bengal", "Other",
];

type Field = "name" | "phone" | "email" | "address" | "city" | "state" | "pincode";

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open(): void; on(ev: string, cb: (r: unknown) => void): void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [online, setOnline] = useState<boolean | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("whatsapp");
  const [form, setForm] = useState<Record<Field, string>>({ name: "", phone: "", email: "", address: "", city: "Nashik", state: "Maharashtra", pincode: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("rb-address");
      if (saved) setForm((f) => ({ ...f, ...JSON.parse(saved) }));
    } catch {}
    fetch("/api/checkout-config")
      .then((r) => r.json())
      .then((c) => {
        setOnline(Boolean(c.razorpay));
        if (c.razorpay) setMethod("razorpay");
      })
      .catch(() => setOnline(false));
  }, []);

  if (!mounted) return <div className="min-h-[50vh]" />;
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[640px] px-5 pt-14">
        <p>Your cart is empty.</p>
        <Link href="/shop" className="font-bold">Go shopping</Link>
      </div>
    );
  }

  const totals = computeTotals(items, method);
  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setErrors({});
    try {
      localStorage.setItem("rb-address", JSON.stringify({ ...form }));
    } catch {}
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ method, customer: form, lines: items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty })) }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBusy(false);
      if (data.issues) {
        const fe: Partial<Record<Field, string>> = {};
        for (const [k, v] of Object.entries(data.issues as Record<string, string[]>)) fe[k as Field] = v?.[0] ?? "Check this";
        setErrors(fe);
      }
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    if (method === "whatsapp") {
      clear();
      window.location.href = data.whatsappUrl;
      return;
    }

    // Razorpay
    if (!window.Razorpay) {
      setBusy(false);
      setError("The payment window didn't load. Check your connection and try again.");
      return;
    }
    const r = data.razorpay;
    const rzp = new window.Razorpay({
      key: r.key,
      order_id: r.orderId,
      amount: r.amount,
      currency: r.currency,
      name: r.name,
      description: "Order from Radhe Boutique",
      prefill: r.prefill,
      theme: { color: "#C81E63" },
      handler: async (resp: Record<string, string>) => {
        const v = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId: data.orderId, ...resp }),
        });
        clear();
        router.push(`/order/${data.orderId}${v.ok ? "" : "?verify=pending"}`);
      },
      modal: { ondismiss: () => setBusy(false) },
    });
    rzp.on("payment.failed", () => {
      setBusy(false);
      setError("Payment didn't go through. You can try again or order on WhatsApp.");
    });
    rzp.open();
  }

  const input = "min-h-12 w-full rounded-xl border border-[#D9B8C4] bg-white px-3.5 text-base";

  return (
    <div className="mx-auto grid max-w-[1100px] gap-8 px-4 pt-6 md:grid-cols-[1fr_360px] md:px-6 md:pt-10">
      {online && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />}
      <form id="checkout-form" onSubmit={placeOrder} className="flex flex-col gap-6" noValidate>
        <h1 className="font-display m-0 text-[44px] leading-none md:text-[64px]">CHECKOUT</h1>

        <fieldset className="m-0 grid gap-3 border-0 p-0 md:grid-cols-2">
          <legend className="mb-3 text-lg font-bold">Delivery details</legend>
          <F label="Full name" err={errors.name} className="md:col-span-2"><input autoComplete="name" required value={form.name} onChange={set("name")} className={input} /></F>
          <F label="Mobile number" err={errors.phone}><input autoComplete="tel-national" inputMode="numeric" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(-10) })} className={input} placeholder="10 digits" /></F>
          <F label="Email (optional)" err={errors.email}><input type="email" autoComplete="email" value={form.email} onChange={set("email")} className={input} /></F>
          <F label="Address" err={errors.address} className="md:col-span-2"><textarea autoComplete="street-address" required rows={3} value={form.address} onChange={set("address")} className={`${input} py-3`} placeholder="House / flat, building, street, area" /></F>
          <F label="City" err={errors.city}><input autoComplete="address-level2" required value={form.city} onChange={set("city")} className={input} /></F>
          <F label="Pincode" err={errors.pincode}><input autoComplete="postal-code" inputMode="numeric" required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} className={input} /></F>
          <F label="State" err={errors.state} className="md:col-span-2">
            <select autoComplete="address-level1" value={form.state} onChange={set("state")} className={input}>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </F>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="mb-3 text-lg font-bold">How to order</legend>
          {online && <Pay id="razorpay" method={method} setMethod={setMethod} title="Pay online" sub="UPI, cards, net banking (Razorpay)" />}
          <Pay id="whatsapp" method={method} setMethod={setMethod} title="Order on WhatsApp" sub="Send the order to us in chat and we'll confirm" />
        </fieldset>

        {error && <p role="alert" className="m-0 rounded-xl bg-[#FBE4E7] p-3 font-bold text-bad">{error}</p>}

        <button disabled={busy} className="min-h-[56px] cursor-pointer rounded-full border-0 bg-pink text-[17px] font-bold text-white disabled:opacity-60 md:hidden">
          {busy ? "Please wait…" : method === "razorpay" ? `Pay ${rupees(totals.total)}` : "Send order on WhatsApp"}
        </button>
      </form>

      <aside className="flex h-fit flex-col gap-3 rounded-[24px] border border-line bg-paper p-5 md:sticky md:top-6 md:mt-[84px]">
        <span className="text-lg font-bold">Your order</span>
        <ul className="m-0 flex list-none flex-col gap-2 p-0 text-sm">
          {items.map((i) => (
            <li key={i.variantId} className="flex justify-between gap-3">
              <span>{i.name} <span className="text-muted">({i.variantName}) × {i.qty}</span></span>
              <span className="font-bold">{rupees(i.unitPrice * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1.5 border-t border-line pt-3 text-[15px]">
          <div className="flex justify-between"><span>Subtotal</span><span>{rupees(totals.subtotal)}</span></div>
          {totals.discount > 0 && <div className="flex justify-between font-bold text-ok"><span>Combo discount</span><span>−{rupees(totals.discount)}</span></div>}
          <div className="flex justify-between"><span>Shipping</span><span>{totals.shipping ? rupees(totals.shipping) : "Free"}</span></div>
          {totals.codFee > 0 && <div className="flex justify-between"><span>COD charge</span><span>{rupees(totals.codFee)}</span></div>}
          <div className="flex justify-between pt-1 text-lg font-bold"><span>Total</span><span>{rupees(totals.total)}</span></div>
        </div>
        <button type="submit" form="checkout-form" disabled={busy} className="hidden min-h-[56px] cursor-pointer rounded-full border-0 bg-pink text-[17px] font-bold text-white disabled:opacity-60 md:block">
          {busy ? "Please wait…" : method === "razorpay" ? `Pay ${rupees(totals.total)}` : "Send order on WhatsApp"}
        </button>
      </aside>
    </div>
  );
}

function F({ label, err, className = "", children }: { label: string; err?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-sm font-bold">{label}</span>
      {children}
      {err && <span className="text-sm font-bold text-bad">{err}</span>}
    </label>
  );
}

function Pay({ id, method, setMethod, title, sub }: { id: PaymentMethod; method: PaymentMethod; setMethod: (m: PaymentMethod) => void; title: string; sub: string }) {
  const on = method === id;
  return (
    <label className={`flex cursor-pointer items-center gap-3 rounded-2xl bg-paper p-4 ${on ? "border-2 border-ink" : "border border-[#D9B8C4]"}`}>
      <input type="radio" name="pay" checked={on} onChange={() => setMethod(id)} className="size-5 accent-pink" />
      <span className="flex flex-col">
        <span className="font-bold">{title}</span>
        <span className="text-sm text-muted">{sub}</span>
      </span>
    </label>
  );
}
