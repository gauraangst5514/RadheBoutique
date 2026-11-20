import type { Product } from "@/lib/types";
import { koreanEarrings } from "./korean-earrings";

/**
 * Sample catalogue used until Supabase is connected (and by supabase/seed.sql).
 * Photos are cropped from the shop's Instagram reels, so they are low resolution.
 * Try-on images under /tryon/ are 3D look-alikes rendered from the hero models
 * (scripts/render-tryon-assets.entry.ts); real products get cut-out photos from the admin.
 * Prices marked "from reel" were shown in the shop's own reels; the others are
 * placeholders to confirm. Stock numbers are examples.
 */
const now = "2026-11-18T00:00:00.000Z";

const shopProducts: Product[] = [
  {
    id: "p-kashmiri-kundan",
    slug: "kashmiri-kundan-earrings",
    name: "Kashmiri Kundan Earrings",
    category: "earrings",
    price: 99, // from reel
    description: "Kundan jhumkas with bead and pearl drops. Lightweight push-back earrings.",
    tags: ["Kundan", "Lowest price Nashik"],
    images: [{ url: "/products/kashmiri-earrings.jpg", kind: "photo", alt: "Kashmiri kundan earrings in red, green and pink" }],
    variants: [
      { id: "v-kk-red", name: "Red", swatch: "#B3123A", sku: "RB-EAR-KK-RED", stock: 6, tryOnImage: "/tryon/jhumka-red.png" },
      { id: "v-kk-green", name: "Green", swatch: "#0E7A4F", sku: "RB-EAR-KK-GRN", stock: 2, tryOnImage: "/tryon/jhumka-green.png" },
      { id: "v-kk-pink", name: "Pink", swatch: "#F2A7C3", sku: "RB-EAR-KK-PNK", stock: 0, tryOnImage: "/tryon/jhumka-pink.png" },
    ],
    tryOn: "earrings",
    active: true,
    featured: true,
    createdAt: now,
  },
  {
    id: "p-rajwadi-choker",
    slug: "rajwadi-choker",
    name: "Rajwadi Elephant Choker",
    category: "necklace-sets",
    price: 199, // from reel
    description: "Gold-look elephant choker with emerald stones and matching studs. Festive special.",
    tags: ["Festive", "With earrings"],
    images: [{ url: "/products/rajwadi-choker.jpg", kind: "photo", alt: "Rajwadi elephant choker with emerald stones" }],
    variants: [{ id: "v-rc-emerald", name: "Emerald", swatch: "#0E7A4F", sku: "RB-NEC-RC-EMR", stock: 2 }],
    tryOn: "necklace",
    active: true,
    featured: true,
    createdAt: now,
  },
  {
    id: "p-hasli-set",
    slug: "hasli-necklace-set",
    name: "Hasli Necklace Set",
    category: "hasli",
    price: 599, // from reel
    description: "Instagram's hot-selling hasli set with ruby and emerald drop, with earrings.",
    tags: ["Hot selling", "With earrings"],
    images: [{ url: "/products/hasli-set.jpg", kind: "photo", alt: "Gold hasli necklace set with ruby and emerald" }],
    variants: [{ id: "v-hs-ruby", name: "Ruby-Emerald", swatch: "#B3123A", sku: "RB-HAS-HS-RUB", stock: 3 }],
    tryOn: "necklace",
    tryOnImage: "/tryon/hasli.png",
    active: true,
    featured: true,
    createdAt: now,
  },
  {
    id: "p-emerald-chain",
    slug: "anti-tarnish-emerald-snake-chain",
    name: "Anti-Tarnish Emerald Snake Chain",
    category: "anti-tarnish",
    price: 149, // from reel
    description: "Golden snake chain with a baguette-cut stone pendant. Roz pehno, office ho ya college.",
    tags: ["Anti-tarnish", "Daily wear"],
    images: [{ url: "/products/emerald-chains.jpg", kind: "photo", alt: "Anti-tarnish snake chains with stone pendants" }],
    variants: [
      { id: "v-ec-emerald", name: "Emerald", swatch: "#0E7A4F", sku: "RB-AT-EC-EMR", stock: 4 },
      { id: "v-ec-ruby", name: "Ruby", swatch: "#B3123A", sku: "RB-AT-EC-RUB", stock: 3 },
      { id: "v-ec-pink", name: "Pink", swatch: "#F2A7C3", sku: "RB-AT-EC-PNK", stock: 2 },
      { id: "v-ec-white", name: "White", swatch: "#F4F1EC", sku: "RB-AT-EC-WHT", stock: 3 },
    ],
    tryOn: "necklace",
    active: true,
    featured: true,
    createdAt: now,
  },
  {
    id: "p-clover-chain",
    slug: "anti-tarnish-clover-pendant",
    name: "Anti-Tarnish Clover Pendant",
    category: "anti-tarnish",
    price: 199, // TODO confirm price
    description: "Four-leaf clover pendant on a flat snake chain. Stays golden.",
    tags: ["Anti-tarnish"],
    images: [{ url: "/products/clover-pendant.jpg", kind: "photo", alt: "Gold clover pendant on a snake chain" }],
    variants: [{ id: "v-cc-gold", name: "Gold", swatch: "#E8B45A", sku: "RB-AT-CC-GLD", stock: 5 }],
    tryOn: "necklace",
    active: true,
    featured: false,
    createdAt: now,
  },
  {
    id: "p-parrot-hasli",
    slug: "hand-painted-parrot-hasli",
    name: "Hand-Painted Parrot Hasli",
    category: "hasli",
    price: 699, // from reel
    description: "Latest trending neckset hasli with hand-painted parrots and lotus centre.",
    tags: ["Hand painted", "Trending"],
    images: [{ url: "/products/parrot-hasli.jpg", kind: "photo", alt: "Hand-painted parrot hasli necklace" }],
    variants: [{ id: "v-ph-multi", name: "Multicolour", swatch: "#C2185B", sku: "RB-HAS-PH-MLT", stock: 2 }],
    tryOn: "necklace",
    active: true,
    featured: true,
    createdAt: now,
  },
  {
    id: "p-green-choker",
    slug: "emerald-pearl-choker",
    name: "Emerald Pearl Choker",
    category: "necklace-sets",
    price: 950, // from reel
    description: "Thoda simple, thoda heavy. Multi-strand pearl choker with emerald and ruby stones.",
    tags: ["Bridal", "Statement"],
    images: [{ url: "/products/green-choker.jpg", kind: "photo", alt: "Pearl choker with emerald stones" }],
    variants: [{ id: "v-gc-emerald", name: "Emerald", swatch: "#0E7A4F", sku: "RB-NEC-GC-EMR", stock: 1 }],
    tryOn: "necklace",
    active: true,
    featured: false,
    createdAt: now,
  },
  {
    id: "p-stone-bracelet",
    slug: "anti-tarnish-stone-bracelet",
    name: "Anti-Tarnish Stone Bracelet",
    category: "bracelets",
    price: 149, // TODO confirm price
    description: "Bezel-set colour stones on a fine anti-tarnish chain.",
    tags: ["Anti-tarnish", "Gifting"],
    images: [{ url: "/products/stone-bracelet.jpg", kind: "photo", alt: "Multicolour stone bracelet" }],
    variants: [{ id: "v-sb-multi", name: "Multicolour", swatch: "#6B8DD6", sku: "RB-BR-SB-MLT", stock: 6 }],
    tryOn: null,
    active: true,
    featured: false,
    createdAt: now,
  },
  {
    id: "p-kurti-branded",
    slug: "branded-cotton-kurti",
    name: "Branded Cotton Kurti",
    category: "kurtis",
    price: 399, // TODO confirm price; 3 for ₹999 bundle applies
    description: "Branded kurti, restocked. Pick any three for ₹999.",
    tags: ["Branded", "3 for ₹999"],
    images: [],
    variants: [
      { id: "v-kb-m", name: "M", swatch: null, sku: "RB-KUR-KB-M", stock: 4 },
      { id: "v-kb-l", name: "L", swatch: null, sku: "RB-KUR-KB-L", stock: 5 },
      { id: "v-kb-xl", name: "XL", swatch: null, sku: "RB-KUR-KB-XL", stock: 3 },
    ],
    tryOn: null,
    active: true,
    featured: false,
    createdAt: now,
  },
];

/**
 * While the Korean Earrings launch is on, the shop's own pieces are hidden (not deleted).
 * Set to false to show them again. On a live Supabase site, use Admin -> Products instead.
 */
const HIDE_SHOP_PRODUCTS = true;

export const seedProducts: Product[] = [
  ...koreanEarrings,
  ...shopProducts.map((p) => (HIDE_SHOP_PRODUCTS ? { ...p, active: false, featured: false } : p)),
];
