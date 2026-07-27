/**
 * Seed script to add wholesale products to Radhe Boutique database.
 * 
 * Pricing formula:
 * - Cost price = wholesale unit price + ₹2
 * - Selling price = (cost price × 2), rounded up to end in 9
 * 
 * Usage: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/seed-products.ts
 * Or:    npx tsx scripts/seed-products.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// --- Product Schema (inline to avoid path alias issues) ---
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 150 },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ url: { type: String, required: true }, publicId: { type: String, required: true } }],
    metal: { type: String, enum: ["gold", "silver", "platinum", "rose-gold"], required: true },
    stone: { type: String, enum: ["diamond", "ruby", "emerald", "sapphire", "none", "other"], default: "none" },
    weight: { type: Number, required: true, min: 0 },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, trim: true }],
    ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  },
  { timestamps: true }
);
productSchema.index({ slug: 1 }, { unique: true });

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    image: { url: { type: String, required: true }, publicId: { type: String, required: true } },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

// --- Helper functions ---
function calculateSellingPrice(unitPrice: number): number {
  const costPrice = unitPrice + 2;
  const doubled = costPrice * 2;
  // Round up to nearest number ending in 9
  const lastDigit = doubled % 10;
  if (lastDigit <= 9) {
    return doubled + (9 - lastDigit);
  }
  return doubled + 9; // shouldn't happen but safety
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function generateDescription(title: string, type: string, tags: string[]): string {
  const typeDesc: Record<string, string> = {
    "grab clip": "Elegant hair clip perfect for everyday styling and special occasions.",
    "hair clip": "Stylish hair clip with a beautiful design to elevate your hairstyle.",
    "hair tie": "Gorgeous hair tie that adds a touch of elegance to any ponytail or bun.",
    "rubberband": "Trendy hair band with floral design, gentle on hair while looking stunning.",
    "jewelry set": "Beautiful necklace and earring set, anti-tarnish quality for lasting shine.",
    "necklace": "Elegant anti-tarnish necklace with premium finish, perfect for daily wear.",
    "earring": "Stunning earrings crafted with anti-tarnish material for a lasting look.",
    "finger ring": "Premium anti-tarnish ring with unique design, adjustable for comfort.",
  };
  const base = typeDesc[type] || "Beautiful accessory crafted with premium quality materials.";
  return `${base} Features: ${tags.join(", ")}. Perfect gift for women and girls.`;
}

function generateShortDescription(title: string, type: string): string {
  // Clean up the title to make a better short description (max 150 chars)
  const cleaned = title
    .replace(/^\d+\s*(Pc|Set|Pairs?)\s*-\s*/i, "")
    .replace(/\(.*?\)/g, "")
    .replace(/Mix Color/gi, "")
    .trim();
  const desc = `${cleaned} - Premium quality, anti-tarnish finish`;
  return desc.substring(0, 150);
}

// --- Category mapping ---
const categoryMap: Record<string, { name: string; slug: string; description: string }> = {
  "grab clip": { name: "Hair Clips", slug: "hair-clips", description: "Stylish hair clips and clutchers for every occasion" },
  "hair clip": { name: "Hair Clips", slug: "hair-clips", description: "Stylish hair clips and clutchers for every occasion" },
  "hair tie": { name: "Hair Accessories", slug: "hair-accessories", description: "Beautiful hair ties, scrunchies and bands" },
  "rubberband": { name: "Hair Accessories", slug: "hair-accessories", description: "Beautiful hair ties, scrunchies and bands" },
  "jewelry set": { name: "Necklace Sets", slug: "necklace-sets", description: "Complete necklace and earring sets" },
  "necklace": { name: "Necklaces", slug: "necklaces", description: "Elegant necklaces and pendants" },
  "earring": { name: "Earrings", slug: "earrings", description: "Stunning earrings for every style" },
  "finger ring": { name: "Rings", slug: "rings", description: "Beautiful rings for every finger" },
};

// Metal type mapping based on product attributes
function determineMetal(title: string, tags: string[]): "gold" | "silver" | "platinum" | "rose-gold" {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("silver")) return "silver";
  if (titleLower.includes("rose")) return "rose-gold";
  if (titleLower.includes("gold")) return "gold";
  if (tags.some(t => t.includes("stainless steel"))) return "silver";
  return "gold";
}

function determineStone(title: string): "diamond" | "ruby" | "emerald" | "sapphire" | "none" | "other" {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("diamond")) return "diamond";
  if (titleLower.includes("ruby")) return "ruby";
  if (titleLower.includes("emerald")) return "emerald";
  if (titleLower.includes("sapphire")) return "sapphire";
  if (titleLower.includes("pearl") || titleLower.includes("stone") || titleLower.includes("tiger eye")) return "other";
  return "none";
}

// --- Products from wholesaler (scraped from Shopify JSON API) ---
// Each entry: { handle, title, unitPrice, setQty, orderedQty (sets ordered), productType, tags, images }
interface WholesaleProduct {
  handle: string;
  title: string;
  totalPrice: number; // total price for the set
  setQty: number; // how many pieces in a set
  orderedQty: number; // how many sets ordered
  productType: string;
  tags: string[];
  images: string[]; // Shopify CDN URLs
}

const wholesaleProducts: WholesaleProduct[] = [
  {
    handle: "yo25",
    title: "Winter Plush Flower Hairpin - Mix Color",
    totalPrice: 222,
    setQty: 6,
    orderedQty: 1,
    productType: "grab clip",
    tags: ["flower clip", "hair accessories", "korean style"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01g2lDO22KUXN2DqLhR__2218294439560-0-cib.jpg?v=1782480697",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN012ASRKm2KUXN31BsCl__2218294439560-0-cib.jpg?v=1765523859",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01ndSLWZ2KUXN3a8Ekf__2218294439560-0-cib.jpg?v=1782480733",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN019ZS1TL2KUXN0yvzAx__2218294439560-0-cib.jpg?v=1782480696",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01mTnkQV2KUXMzcvt1U__2218294439560-0-cib.jpg?v=1782480696",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01sDymGR2KUXN2Dmzn6__2218294439560-0-cib.jpg?v=1782480696",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01KiRAx12KUXN2EDmWM__2218294439560-0-cib.jpg?v=1782480759",
    ],
  },
  {
    handle: "yo22",
    title: "Winter Plush Flower Princess Grabber High-End Petal Clip",
    totalPrice: 180,
    setQty: 6,
    orderedQty: 1,
    productType: "grab clip",
    tags: ["flower clip", "hair accessories", "shark clip"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01iESf4w2KUXONEXbZ1__2218294439560-0-cib.jpg?v=1765523855",
    ],
  },
  {
    handle: "yo17",
    title: "Fairy-Style Tulle Rose Acrylic Hair Clip Clutcher - Mix Color",
    totalPrice: 246,
    setQty: 6,
    orderedQty: 1,
    productType: "hair clip",
    tags: ["korean style", "rose clip", "acrylic"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01UCyc5F2KUXMd8EsrD__2218294439560-0-cib.jpg?v=1765523848",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01JuIe3f2KUXMg1pwnw__2218294439560-0-cib.jpg?v=1765523852",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN0190td2r2KUXMb4x0vN__2218294439560-0-cib.jpg?v=1782477327",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01GawycD2KUXMcuCwAE__2218294439560-0-cib_bc6f4167-e56d-4562-82fd-93a062ee90e1.jpg?v=1782477327",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01QDNTPL2KUXTsAgOWQ__2218294439560-0-cib.jpg?v=1782477327",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01d1o0zM2KUXMcuE4y0__2218294439560-0-cib_e5f02dc0-25b4-48dd-b931-9acb97bad74f.jpg?v=1782477327",
    ],
  },
  {
    handle: "yo10",
    title: "Flower Hair Ties for Girls - Mix Color",
    totalPrice: 192,
    setQty: 6,
    orderedQty: 1,
    productType: "hair tie",
    tags: ["scrunchies", "hair ties", "floral"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN014ns07j2KUXMcPLwHY__2218294439560-0-cib_7f5aa921-fa0b-4f49-bda6-aaa6256a3695.jpg?v=1765523843",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01CEC4Wo2KUXMWkz3pF__2218294439560-0-cib_5fa0b730-9cef-48f3-8ee7-6d1679f47aa3.jpg?v=1765523852",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01FKAAfz2KUXMfck1bN__2218294439560-0-cib.jpg?v=1765523841",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01n0aS7e2KUXMfE6yuh__2218294439560-0-cib_1.jpg?v=1782476723",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN015WdaKP2KUXMfcxzTN__2218294439560-0-cib_ca1c7f90-d0b7-43ec-b989-bd56025236bf.jpg?v=1782476722",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01EtThOO2KUXMeVCmPJ__2218294439560-0-cib.jpg?v=1782476691",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01k05pR32KUXMhLRC6g__2218294439560-0-cib_61e71c54-c2f4-465e-82e8-d3384d89b279.jpg?v=1782476721",
    ],
  },
  {
    handle: "yo6",
    title: "French Retro Rose Flower Girls Hair Rope - Mix Color",
    totalPrice: 120,
    setQty: 6,
    orderedQty: 1,
    productType: "rubberband",
    tags: ["korean style", "retro", "floral hair rope"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01L5mSql2KUXMeZBe05__2218294439560-0-cib.jpg?v=1765523836",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01SWTc8Z2KUXMbMJa2E__2218294439560-0-cib.jpg?v=1765523835",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01AFJ9JB2KUXMb2katA__2218294439560-0-cib_dda625d4-b001-4799-a189-eba535f96cbf.jpg?v=1782476366",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01NJuOyi2KUXMfTf6wk__2218294439560-0-cib_e952272f-ce34-48ce-bea6-5638cc8df8d4.jpg?v=1782476398",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01mj8aaG2KUXMeAPTLY__2218294439560-0-cib_80f75642-53a4-4e89-a987-fe234d86d803.jpg?v=1782476398",
    ],
  },
  {
    handle: "yo1",
    title: "Hand-Woven Fabric Rose Flower Women's Hair Tie - Mix Color",
    totalPrice: 216,
    setQty: 6,
    orderedQty: 1,
    productType: "hair tie",
    tags: ["korean style", "hand woven", "fabric rose"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01aDACRW2KUXMlRwTKQ__2218294439560-0-cib.jpg?v=1765523830",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01M4qgDz2KUXMnbMFBf__2218294439560-0-cib_5af63689-e4a5-482f-ac8b-afeddcc486e0.jpg?v=1782458950",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01uYkSgj2KUXMg7DLas__2218294439560-0-cib_443af289-e8d0-46bf-83a1-82443887b617.jpg?v=1782458957",
    ],
  },
  {
    handle: "yj279",
    title: "Anti Tarnish Round Diamond White Pearl Necklace and Earring Set Gold",
    totalPrice: 450,
    setQty: 3,
    orderedQty: 1,
    productType: "jewelry set",
    tags: ["pearl", "stainless steel", "necklace set", "anti tarnish"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01iHJFEH1Z3iMVT1e2e__2215578603139-0-cib.jpg?v=1781613834",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01uWUs2i1Z3iMUbVlAm__2215578603139-0-cib.jpg?v=1781613834",
    ],
  },
  {
    handle: "yj278",
    title: "Anti Tarnish Purple Diamond Love Necklace Gold",
    totalPrice: 234,
    setQty: 3,
    orderedQty: 1,
    productType: "necklace",
    tags: ["korean necklace", "anti tarnish", "purple diamond"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01SpWSt21Z3iM6tl85g__2215578603139-0-cib.jpg?v=1781613833",
    ],
  },
  {
    handle: "yj277",
    title: "Anti Tarnish Purple Diamond Flower Necklace Gold",
    totalPrice: 276,
    setQty: 3,
    orderedQty: 1,
    productType: "necklace",
    tags: ["korean style", "anti tarnish", "flower pendant"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01gh6lLX1Z3iM7KOJzl__2215578603139-0-cib.jpg?v=1781613832",
    ],
  },
  {
    handle: "yj276",
    title: "Anti Tarnish Purple Diamond Round Necklace Gold",
    totalPrice: 249,
    setQty: 3,
    orderedQty: 1,
    productType: "necklace",
    tags: ["korean jewelry", "anti tarnish", "round pendant"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01QXosqp1Z3iM7GVNWp__2215578603139-0-cib.jpg?v=1781613829",
    ],
  },
  {
    handle: "yj275",
    title: "Anti Tarnish Purple Diamond Four-Leaf Clover Necklace Gold",
    totalPrice: 276,
    setQty: 3,
    orderedQty: 1,
    productType: "necklace",
    tags: ["anti tarnish", "clover necklace", "lucky charm"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01YopT5A1Z3iM6iTFiu__2215578603139-0-cib.jpg?v=1781613828",
    ],
  },
  {
    handle: "yj274",
    title: "Anti Tarnish Water Drop Earrings Silver",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "earring",
    tags: ["korean jewelry", "water drop", "anti tarnish"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01pi2qSq1Z3i7q2sNrK__2215578603139-0-cib.jpg?v=1781613826",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01OMXbR01Z3i7mekOo7__2215578603139-0-cib.jpg?v=1781613826",
    ],
  },
  {
    handle: "yj273",
    title: "Anti Tarnish Fan-Shaped Tiger Eye Stone Necklace Gold",
    totalPrice: 351,
    setQty: 3,
    orderedQty: 1,
    productType: "necklace",
    tags: ["stainless steel", "tiger eye", "gemstone necklace"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01AFpW5c1Z3iF6jHAW2__2215578603139-0-cib.jpg?v=1781613825",
    ],
  },
  {
    handle: "yj272",
    title: "Anti Tarnish Geometric Tiger Eye Stone Necklace Gold",
    totalPrice: 351,
    setQty: 3,
    orderedQty: 1,
    productType: "necklace",
    tags: ["korean style", "tiger eye", "geometric pendant"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01tLwFqs1Z3iF6jF9f8__2215578603139-0-cib.jpg?v=1781613824",
    ],
  },
  {
    handle: "yj271",
    title: "Anti Tarnish Oval Tiger Eye Necklace Gold",
    totalPrice: 366,
    setQty: 3,
    orderedQty: 1,
    productType: "necklace",
    tags: ["stainless steel", "tiger eye", "oval pendant"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01X61g8j1Z3iF3SX1yt__2215578603139-0-cib.jpg?v=1781613822",
    ],
  },
  {
    handle: "yj270",
    title: "Anti Tarnish Five-Petal Stamen Ring Gold",
    totalPrice: 222,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["anti tarnish", "floral ring", "stainless steel"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01USAncF1Z3iLohPj1J__2215578603139-0-cib.jpg?v=1781613821",
    ],
  },
  {
    handle: "yj269",
    title: "Anti Tarnish Seahorse Ring Gold",
    totalPrice: 150,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["anti tarnish", "seahorse", "ocean theme"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01TT8ASX1Z3iLiUxfoE__2215578603139-0-cib.jpg?v=1781613820",
    ],
  },
  {
    handle: "yj268",
    title: "Anti Tarnish Starfish Ring Gold",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["stainless steel", "starfish", "beach theme"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01nEqtGc1Z3iLosqtFB__2215578603139-0-cib.jpg?v=1781613818",
    ],
  },
  {
    handle: "yj267",
    title: "Anti Tarnish Starfish Conch Ring Silver",
    totalPrice: 117,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["korean jewelry", "starfish", "conch shell"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01fkLK0Q1Hk9wyA1kPE__2218403830795-0-cib.jpg?v=1781613818",
    ],
  },
  {
    handle: "yj266",
    title: "Anti Tarnish Starfish Conch Ring Gold",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["anti tarnish", "starfish", "gold plated"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01Iu8fCz1Z3iLohOqpx__2215578603139-0-cib.jpg?v=1781613816",
    ],
  },
  {
    handle: "yj265",
    title: "Anti Tarnish Double-Layer Twisted Ring Silver",
    totalPrice: 117,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["stainless steel", "twisted ring", "minimalist"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01C5l5gv1OW98ymBE0t__2214141111712-0-cib.jpg?v=1781613815",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01vXI1AN1OW98z5dt5u__2214141111712-0-cib.jpg?v=1781613813",
    ],
  },
  {
    handle: "yj264",
    title: "Anti Tarnish Double-Layer Twisted Ring Gold",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["artificial jewelry", "twisted design", "gold plated"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN014yeyLK1Z3iLntvFV4__2215578603139-0-cib.jpg?v=1781613813",
    ],
  },
  {
    handle: "yj263",
    title: "Anti Tarnish Wheat Ear Ring Silver",
    totalPrice: 117,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["stainless steel", "wheat design", "nature inspired"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01iEzVc71orNKz49inc__2213957665278-0-cib.jpg?v=1781613811",
    ],
  },
  {
    handle: "yj262",
    title: "Anti Tarnish Wheat Ear Ring Gold",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["korean jewelry", "wheat ear", "gold plated"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01Bwab501Z3iLiURBCv__2215578603139-0-cib.jpg?v=1781613809",
    ],
  },
  {
    handle: "yj261",
    title: "Anti Tarnish Hollow Cross Ring Gold",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["anti tarnish", "cross ring", "faith jewelry"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01LqQFDC2BWz3vE2kgX__2216486648347-0-cib.jpg?v=1781613808",
    ],
  },
  {
    handle: "yj260",
    title: "Anti Tarnish Three Shell Ring Gold",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["stainless steel", "shell ring", "ocean theme"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01mJNROH265R97kYwDu__2220253787610-0-cib.jpg?v=1781613807",
    ],
  },
  {
    handle: "yj259",
    title: "Anti Tarnish Four-Layer Irregular Ring Gold",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["anti tarnish", "layered ring", "statement ring"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01PAQ6jJ1oLmCERTLJc__2219069585209-0-cib.jpg?v=1781613806",
    ],
  },
  {
    handle: "yj258",
    title: "Anti Tarnish Shell Starfish Ring Silver",
    totalPrice: 117,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["stainless steel", "shell starfish", "beach jewelry"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN015aGgLv25HVrhaT76b__2215710057501-0-cib.jpg?v=1781613804",
    ],
  },
  {
    handle: "yj257",
    title: "Anti Tarnish Shell Starfish Ring Gold",
    totalPrice: 138,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["artificial jewelry", "shell starfish", "gold plated"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01EUPSBE25HVrcFbzua__2215710057501-0-cib.jpg?v=1781613803",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01t0ncGP1rpxBzXbZS1__2219984175681-0-cib.jpg?v=1781613803",
    ],
  },
  {
    handle: "yj256",
    title: "Anti Tarnish Double-Layer V-Shaped Ring Silver",
    totalPrice: 117,
    setQty: 3,
    orderedQty: 1,
    productType: "finger ring",
    tags: ["korean style", "v-shaped", "minimalist ring"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01Em12wk1OW99hWUruF__2214141111712-0-cib.jpg?v=1781613803",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01AHVHq81ycOjg0TYbj__2220133686599-0-cib.jpg?v=1781613802",
    ],
  },
];

// --- Main seed function ---
async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // Step 1: Create/find categories
  console.log("\n📁 Creating categories...");
  const categoryIds: Record<string, mongoose.Types.ObjectId> = {};
  const uniqueCategories = Object.values(categoryMap).filter(
    (cat, i, arr) => arr.findIndex((c) => c.slug === cat.slug) === i
  );

  for (const cat of uniqueCategories) {
    let existing = await Category.findOne({ slug: cat.slug });
    if (!existing) {
      existing = await Category.create({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: {
          url: "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01g2lDO22KUXN2DqLhR__2218294439560-0-cib.jpg?v=1782480697",
          publicId: `category-${cat.slug}`,
        },
        isActive: true,
      });
      console.log(`  ✅ Created category: ${cat.name}`);
    } else {
      console.log(`  ℹ️  Category exists: ${cat.name}`);
    }
    categoryIds[cat.slug] = existing._id;
  }

  // Step 2: Create products
  console.log("\n📦 Creating products...");
  let created = 0;
  let skipped = 0;

  for (const wp of wholesaleProducts) {
    const slug = generateSlug(wp.title);
    
    // Check if product already exists
    const existing = await Product.findOne({ $or: [{ slug }, { sku: wp.handle.toUpperCase() }] });
    if (existing) {
      console.log(`  ⏭️  Skipped (exists): ${wp.title}`);
      skipped++;
      continue;
    }

    // Calculate pricing
    const unitPrice = wp.totalPrice / wp.setQty;
    const sellingPrice = calculateSellingPrice(unitPrice);
    
    // Determine category
    const catInfo = categoryMap[wp.productType] || categoryMap["earring"];
    const categoryId = categoryIds[catInfo.slug];

    // Stock = orderedQty * setQty (total individual pieces)
    const stock = wp.orderedQty * wp.setQty;

    // Build product
    const product = {
      name: wp.title,
      slug,
      description: generateDescription(wp.title, wp.productType, wp.tags),
      shortDescription: generateShortDescription(wp.title, wp.productType),
      price: sellingPrice,
      category: categoryId,
      images: wp.images.map((url, i) => ({
        url,
        publicId: `wholesale-${wp.handle}-${i}`,
      })),
      metal: determineMetal(wp.title, wp.tags),
      stone: determineStone(wp.title),
      weight: 0,
      sku: wp.handle.toUpperCase(),
      stock,
      featured: false,
      isActive: true,
      tags: wp.tags,
    };

    await Product.create(product);
    console.log(`  ✅ Created: ${wp.title} | Price: ₹${sellingPrice} | Stock: ${stock}`);
    created++;
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 SEED SUMMARY");
  console.log("=".repeat(50));
  console.log(`  Products created: ${created}`);
  console.log(`  Products skipped: ${skipped}`);
  console.log(`  Categories: ${uniqueCategories.length}`);
  console.log("");
  console.log("💰 PRICING BREAKDOWN:");
  console.log("-".repeat(50));
  for (const wp of wholesaleProducts) {
    const unitPrice = wp.totalPrice / wp.setQty;
    const costPrice = unitPrice + 2;
    const sellingPrice = calculateSellingPrice(unitPrice);
    console.log(
      `  ${wp.handle.toUpperCase().padEnd(6)} | Unit: ₹${unitPrice.toFixed(0).padStart(4)} | Cost: ₹${costPrice.toFixed(0).padStart(4)} | Sell: ₹${sellingPrice.toString().padStart(4)} | Stock: ${(wp.orderedQty * wp.setQty).toString().padStart(2)}`
    );
  }

  await mongoose.disconnect();
  console.log("\n✅ Done! Database seeded successfully.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
