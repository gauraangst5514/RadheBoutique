import { store } from "@/config/store";
import type { Product, Variant } from "@/lib/types";

export function stockLabel(v: Variant): { text: string; tone: "ok" | "warn" | "bad" } {
  if (v.stock <= 0) return { text: `Sold out in ${v.name}`, tone: "bad" };
  if (v.stock <= store.lowStockAt) return { text: `Only ${v.stock} left in ${v.name}`, tone: "warn" };
  return { text: "In stock", tone: "ok" };
}

export function totalStock(p: Product) {
  return p.variants.reduce((s, v) => s + v.stock, 0);
}

export function lowestStockBadge(p: Product): string | null {
  const total = totalStock(p);
  if (total === 0) return "Sold out";
  return total <= store.lowStockAt ? `Only ${total} left` : null;
}
