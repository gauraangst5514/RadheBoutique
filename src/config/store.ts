/**
 * Shop-wide settings. Anything marked TODO is a business decision for the family:
 * change the value here and redeploy.
 */
export const store = {
  name: "Radhe Boutique",
  city: "Nashik",
  whatsapp: "919272572944", // used for wa.me links (country code, no +)
  phoneDisplay: "92725 72944",
  instagram: "https://www.instagram.com/radheboutiquenashik5514/",
  instagramHandle: "radheboutiquenashik5514",
  address: "Roongtha SSRF Mall, 4th floor, Shop 4028, next to City Center Mall, Nashik",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Roongtha+SSRF+Mall+Nashik",

  // TODO: set real shipping rules. Amounts are in rupees.
  shipping: {
    flatFee: 0,
    freeAbove: 0, // 0 = always free; otherwise free when subtotal >= this
  },
  // Cash on delivery is switched off (checkout offers Razorpay and WhatsApp only).
  codFee: 0,
  // Show "Only X left" when a variant's stock is at or below this.
  lowStockAt: 3,
} as const;

/**
 * "On the reels" on the homepage: the shop's most-viewed Instagram reels.
 * `code` is the part after /reel/ in the link. Views were counted on 20 Nov 2026;
 * update them (or swap reels) whenever you like.
 */
export const topReels: { code: string; views: string; label: string }[] = [
  { code: "DejLVw_OuJx", views: "20.7K", label: "Branded kurtis, just ₹299" },
  { code: "De8tcYGIAdO", views: "8.7K", label: "Party-wear kurtis, 999 me 3" },
  { code: "DfycP0kuWxh", views: "7.9K", label: "Hand-painted hasli" },
  { code: "DfKp39UNhSO", views: "7K", label: "Necklace set, just ₹249" },
  { code: "DeULhLZOsPE", views: "7K", label: "Snake waist chain, just ₹199" },
];

export type CategorySlug =
  | "korean-earrings"
  | "anti-tarnish"
  | "earrings"
  | "necklace-sets"
  | "hasli"
  | "bracelets"
  | "rings"
  | "kurtis";

export const categories: { slug: CategorySlug; name: string; blurb: string }[] = [
  { slug: "korean-earrings", name: "Korean Earrings", blurb: "Trendy, from ₹29" },
  { slug: "anti-tarnish", name: "Anti-Tarnish", blurb: "Stays golden, daily wear" },
  { slug: "earrings", name: "Earrings", blurb: "Kashmiri, kundan, jhumkas" },
  { slug: "necklace-sets", name: "Necklace Sets", blurb: "Chokers and sets" },
  { slug: "hasli", name: "Hasli", blurb: "Rajwadi and hand-painted" },
  { slug: "bracelets", name: "Bracelets", blurb: "Stone and chain" },
  { slug: "rings", name: "Rings", blurb: "AD and anti-tarnish" },
  { slug: "kurtis", name: "Kurtis", blurb: "Branded combos" },
];

/**
 * Bundle deals: every full group of `size` eligible pieces costs `price`.
 * The kurti deal comes from the shop's own "999 me 3" offer.
 */
export const bundles: { id: string; label: string; category: CategorySlug; size: number; price: number; enabled: boolean }[] = [
  { id: "kurti-3-999", label: "3 kurtis for ₹999", category: "kurtis", size: 3, price: 999, enabled: true },
];

export function categoryName(slug: string) {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}
