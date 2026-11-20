import type { Product } from "@/lib/types";

/** Colours of a product that can be tried on live (each needs a transparent try-on image). */
export function tryOnOptions(p: Product) {
  if (!p.tryOn) return [];
  return p.variants
    .map((v) => ({ variantId: v.id, name: v.name, swatch: v.swatch ?? null, image: v.tryOnImage || p.tryOnImage || "", stock: v.stock }))
    .filter((o) => o.image);
}

export function canTryOn(p: Product) {
  return tryOnOptions(p).length > 0;
}
