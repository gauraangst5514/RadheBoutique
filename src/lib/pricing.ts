import { bundles, store, type CategorySlug } from "@/config/store";
import type { PaymentMethod } from "@/lib/types";

export interface PricedLine {
  category: CategorySlug;
  unitPrice: number;
  qty: number;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  bundleNotes: string[];
}

/** Same maths on the client (display) and the server (what we actually charge). */
export function computeTotals(lines: PricedLine[], method: PaymentMethod = "razorpay"): Totals {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  let discount = 0;
  const bundleNotes: string[] = [];

  for (const b of bundles.filter((x) => x.enabled)) {
    // Expand to single units, most expensive first, so the deal saves the most.
    const units = lines
      .filter((l) => l.category === b.category)
      .flatMap((l) => Array.from({ length: l.qty }, () => l.unitPrice))
      .sort((a, z) => z - a);
    const groups = Math.floor(units.length / b.size);
    let saved = 0;
    for (let g = 0; g < groups; g++) {
      const groupSum = units.slice(g * b.size, g * b.size + b.size).reduce((s, x) => s + x, 0);
      if (groupSum > b.price) saved += groupSum - b.price;
    }
    if (saved > 0) {
      discount += saved;
      bundleNotes.push(`${b.label} ×${groups}`);
    } else if (units.length > 0 && units.length % b.size !== 0) {
      bundleNotes.push(`Add ${b.size - (units.length % b.size)} more for ${b.label}`);
    }
  }

  const afterDiscount = subtotal - discount;
  const freeAbove = store.shipping.freeAbove;
  const shipping = lines.length === 0 ? 0 : freeAbove > 0 && afterDiscount >= freeAbove ? 0 : store.shipping.flatFee;
  const codFee = method === "cod" ? store.codFee : 0;
  return { subtotal, discount, shipping, codFee, total: afterDiscount + shipping + codFee, bundleNotes };
}

export function rupees(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
