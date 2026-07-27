/**
 * Comprehensive seed script for ALL 58 products from wholesale order.
 * Seeds products into Radhe Boutique database with Cloudinary image uploads.
 *
 * Pricing formula: sellingPrice = ((unitPrice + 2) * 2) rounded UP to end in 9
 * Stock: 3 for rings/necklaces/sets, 6 for earrings
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node","esModuleInterop":true}' scripts/seed-all-products.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Inline Schemas (avoid path alias issues) ---
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
productSchema.index({ sku: 1 }, { unique: true });

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

// --- Helper Functions ---
function calculateSellingPrice(unitPrice: number): number {
  const costPrice = unitPrice + 2;
  const doubled = costPrice * 2;
  const lastDigit = doubled % 10;
  if (lastDigit === 9) return doubled;
  if (lastDigit < 9) return doubled + (9 - lastDigit);
  return doubled + (19 - lastDigit); // e.g. if last digit is > 9 (won't happen but safety)
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadToCloudinary(
  imageUrl: string,
  sku: string,
  index: number
): Promise<{ url: string; publicId: string } | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `radhe-boutique/products/${sku.toLowerCase()}`,
      public_id: `${sku.toLowerCase()}-${index + 1}`,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error: any) {
    console.error(`    ❌ Cloudinary upload failed: ${error.message}`);
    return null;
  }
}

// --- Product Data Interface ---
interface SeedProduct {
  sku: string;
  name: string;
  unitPrice: number;
  setQty: number;
  productType: "earring" | "necklace" | "finger ring" | "jewelry set";
  metal: "gold" | "silver";
  stone: "none" | "diamond" | "other";
  tags: string[];
  images: string[]; // Shopify CDN URLs (empty if not available)
}

// --- ALL 58 PRODUCTS ---
const ALL_PRODUCTS: SeedProduct[] = [
  // ===== RINGS (7 products, 3 Pc sets) =====
  {
    sku: "RB-001",
    name: "Anti Tarnish Heart-Shaped Ring Gold",
    unitPrice: 46,
    setQty: 3,
    productType: "finger ring",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "heart ring", "stainless steel", "adjustable"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01EUPSBE25HVrcFbzua__2215710057501-0-cib.jpg?v=1781613803",
    ],
  },
  {
    sku: "RB-002",
    name: "Anti Tarnish Heart-Shaped Ring Gold Design 2",
    unitPrice: 46,
    setQty: 3,
    productType: "finger ring",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "heart ring", "stainless steel", "adjustable"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01t0ncGP1rpxBzXbZS1__2219984175681-0-cib.jpg?v=1781613803",
    ],
  },
  {
    sku: "RB-003",
    name: "Anti Tarnish Starfish Ring Gold",
    unitPrice: 46,
    setQty: 3,
    productType: "finger ring",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "starfish", "beach theme", "stainless steel"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01nEqtGc1Z3iLosqtFB__2215578603139-0-cib.jpg?v=1781613818",
    ],
  },
  {
    sku: "RB-004",
    name: "Anti Tarnish Four-Layer Irregular Ring Gold",
    unitPrice: 46,
    setQty: 3,
    productType: "finger ring",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "layered ring", "statement ring", "stainless steel"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01PAQ6jJ1oLmCERTLJc__2219069585209-0-cib.jpg?v=1781613806",
    ],
  },
  {
    sku: "RB-005",
    name: "Anti Tarnish Double-Layer V-Shaped Ring Gold",
    unitPrice: 46,
    setQty: 3,
    productType: "finger ring",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "v-shaped", "minimalist", "stainless steel"],
    images: [],
  },
  {
    sku: "RB-006",
    name: "Anti Tarnish Double-Layer V-Shaped Ring Silver",
    unitPrice: 39,
    setQty: 3,
    productType: "finger ring",
    metal: "silver",
    stone: "none",
    tags: ["anti tarnish", "v-shaped", "minimalist ring", "stainless steel"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01Em12wk1OW99hWUruF__2214141111712-0-cib.jpg?v=1781613803",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01AHVHq81ycOjg0TYbj__2220133686599-0-cib.jpg?v=1781613802",
    ],
  },
  {
    sku: "RB-007",
    name: "Anti Tarnish Multi-Layered Winding Ring Gold",
    unitPrice: 46,
    setQty: 3,
    productType: "finger ring",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "winding ring", "statement", "stainless steel"],
    images: [],
  },
  // ===== NECKLACES (17 products, 3 Pc sets) =====
  {
    sku: "RB-008",
    name: "Anti Tarnish Bow Necklace Gold",
    unitPrice: 70,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "bow pendant", "stainless steel", "korean style"],
    images: [],
  },
  {
    sku: "RB-009",
    name: "Anti Tarnish Leaves Necklace Gold",
    unitPrice: 76,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "leaf pendant", "nature inspired", "stainless steel"],
    images: [],
  },
  {
    sku: "RB-010",
    name: "Anti Tarnish Ball Bead Chain Necklace Gold",
    unitPrice: 55,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "ball chain", "minimalist", "stainless steel"],
    images: [],
  },
  {
    sku: "RB-011",
    name: "Anti Tarnish Heart-Shaped Necklace Silver",
    unitPrice: 58,
    setQty: 3,
    productType: "necklace",
    metal: "silver",
    stone: "none",
    tags: ["anti tarnish", "heart pendant", "stainless steel", "elegant"],
    images: [],
  },
  {
    sku: "RB-012",
    name: "Anti Tarnish Diamond Drop Necklace Gold",
    unitPrice: 67,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "diamond",
    tags: ["anti tarnish", "diamond drop", "stainless steel", "premium"],
    images: [],
  },
  {
    sku: "RB-013",
    name: "Anti Tarnish Round Link Chain Drop-Shaped Necklace Silver",
    unitPrice: 46,
    setQty: 3,
    productType: "necklace",
    metal: "silver",
    stone: "none",
    tags: ["anti tarnish", "chain necklace", "drop shaped", "stainless steel"],
    images: [],
  },
  {
    sku: "RB-014",
    name: "Anti Tarnish Cross Pearl Necklace Gold",
    unitPrice: 58,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "other",
    tags: ["anti tarnish", "cross pendant", "pearl", "stainless steel"],
    images: [],
  },
  {
    sku: "RB-015",
    name: "Anti Tarnish Shell Necklace Gold",
    unitPrice: 70,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "shell pendant", "ocean theme", "stainless steel"],
    images: [],
  },
  {
    sku: "RB-016",
    name: "Anti Tarnish Square Black Shell Necklace Gold",
    unitPrice: 76,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "none",
    tags: ["anti tarnish", "black shell", "square pendant", "stainless steel"],
    images: [],
  },
  {
    sku: "RB-017",
    name: "Anti Tarnish Seven Pearls Necklace Gold",
    unitPrice: 89,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "other",
    tags: ["anti tarnish", "pearl necklace", "elegant", "stainless steel"],
    images: [],
  },
  {
    sku: "RB-018",
    name: "Anti Tarnish Purple Diamond Love Necklace Gold",
    unitPrice: 78,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "diamond",
    tags: ["anti tarnish", "purple diamond", "love pendant", "korean style"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01SpWSt21Z3iM6tl85g__2215578603139-0-cib.jpg?v=1781613833",
    ],
  },
  {
    sku: "RB-019",
    name: "Anti Tarnish Purple Diamond Flower Necklace Gold",
    unitPrice: 92,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "diamond",
    tags: ["anti tarnish", "purple diamond", "flower pendant", "korean style"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01gh6lLX1Z3iM7KOJzl__2215578603139-0-cib.jpg?v=1781613832",
    ],
  },
  {
    sku: "RB-020",
    name: "Anti Tarnish Purple Diamond Round Necklace Gold",
    unitPrice: 83,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "diamond",
    tags: ["anti tarnish", "purple diamond", "round pendant", "stainless steel"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01QXosqp1Z3iM7GVNWp__2215578603139-0-cib.jpg?v=1781613829",
    ],
  },
  {
    sku: "RB-021",
    name: "Anti Tarnish Purple Diamond Four-Leaf Clover Necklace Gold",
    unitPrice: 92,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "diamond",
    tags: ["anti tarnish", "four-leaf clover", "lucky charm", "purple diamond"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01YopT5A1Z3iM6iTFiu__2215578603139-0-cib.jpg?v=1781613828",
    ],
  },
  {
    sku: "RB-022",
    name: "Anti Tarnish Oval Tiger Eye Necklace Gold",
    unitPrice: 122,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "other",
    tags: ["anti tarnish", "tiger eye", "oval pendant", "gemstone"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01X61g8j1Z3iF3SX1yt__2215578603139-0-cib.jpg?v=1781613822",
    ],
  },
  {
    sku: "RB-023",
    name: "Anti Tarnish Geometric Tiger Eye Stone Necklace Gold",
    unitPrice: 117,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "other",
    tags: ["anti tarnish", "tiger eye", "geometric pendant", "stainless steel"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01tLwFqs1Z3iF6jF9f8__2215578603139-0-cib.jpg?v=1781613824",
    ],
  },
  {
    sku: "RB-024",
    name: "Anti Tarnish Fan-Shaped Tiger Eye Stone Necklace Gold",
    unitPrice: 117,
    setQty: 3,
    productType: "necklace",
    metal: "gold",
    stone: "other",
    tags: ["anti tarnish", "tiger eye", "fan shaped", "stainless steel"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01AFpW5c1Z3iF6jHAW2__2215578603139-0-cib.jpg?v=1781613825",
    ],
  },
  // ===== JEWELRY SETS (2 products, 3 sets each) =====
  {
    sku: "RB-025",
    name: "Anti Tarnish Zircon Bow Earring Necklace Set Gold",
    unitPrice: 87,
    setQty: 3,
    productType: "jewelry set",
    metal: "gold",
    stone: "diamond",
    tags: ["anti tarnish", "zircon", "bow set", "necklace earring set"],
    images: [],
  },
  {
    sku: "RB-026",
    name: "Anti Tarnish Round Diamond White Pearl Necklace and Earring Set Gold",
    unitPrice: 150,
    setQty: 3,
    productType: "jewelry set",
    metal: "gold",
    stone: "other",
    tags: ["anti tarnish", "pearl", "diamond", "necklace earring set"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01iHJFEH1Z3iMVT1e2e__2215578603139-0-cib.jpg?v=1781613834",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01uWUs2i1Z3iMUbVlAm__2215578603139-0-cib.jpg?v=1781613834",
    ],
  },

  // ===== ANTI TARNISH EARRINGS (1 product, 3 pairs) =====
  {
    sku: "RB-027",
    name: "Anti Tarnish Water Drop Earrings Silver",
    unitPrice: 46,
    setQty: 3,
    productType: "earring",
    metal: "silver",
    stone: "none",
    tags: ["anti tarnish", "water drop", "stainless steel", "elegant"],
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01pi2qSq1Z3i7q2sNrK__2215578603139-0-cib.jpg?v=1781613826",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01OMXbR01Z3i7mekOo7__2215578603139-0-cib.jpg?v=1781613826",
    ],
  },
  // ===== FASHION EARRINGS (31 products, 6 pairs each) =====
  {
    sku: "RB-028",
    name: "Fashion Leaves Petals Earrings Golden",
    unitPrice: 38,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["fashion", "leaves", "petals", "korean style"],
    images: [],
  },
  {
    sku: "RB-029",
    name: "Retro Irregular Square Earrings Mix Color",
    unitPrice: 30,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["retro", "square", "geometric", "mix color"],
    images: [],
  },
  {
    sku: "RB-030",
    name: "Hollow Water Drop Minimalist Earrings Golden",
    unitPrice: 27,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["hollow", "water drop", "minimalist", "everyday wear"],
    images: [],
  },
  {
    sku: "RB-031",
    name: "Velvet Flower Earrings Mix Color",
    unitPrice: 33,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["velvet", "flower", "floral", "mix color"],
    images: [],
  },
  {
    sku: "RB-032",
    name: "Hollow Drop Earrings Silver",
    unitPrice: 18,
    setQty: 6,
    productType: "earring",
    metal: "silver",
    stone: "none",
    tags: ["hollow", "drop", "minimalist", "silver"],
    images: [],
  },
  {
    sku: "RB-033",
    name: "New Geometric U-Shaped Earrings Silver",
    unitPrice: 12,
    setQty: 6,
    productType: "earring",
    metal: "silver",
    stone: "none",
    tags: ["geometric", "u-shaped", "minimalist", "daily wear"],
    images: [],
  },
  {
    sku: "RB-034",
    name: "Square Style Fashionable Earrings Black Color",
    unitPrice: 23,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["square", "fashionable", "black", "statement"],
    images: [],
  },
  {
    sku: "RB-035",
    name: "New Geometric U-Shaped Earrings Golden",
    unitPrice: 12,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["geometric", "u-shaped", "minimalist", "daily wear"],
    images: [],
  },
  {
    sku: "RB-036",
    name: "Camellia Earrings Mix Color",
    unitPrice: 33,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["camellia", "flower", "elegant", "mix color"],
    images: [],
  },
  {
    sku: "RB-037",
    name: "Rhinestones Pearl Earrings Mix Color",
    unitPrice: 26,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "other",
    tags: ["rhinestone", "pearl", "elegant", "mix color"],
    images: [],
  },
  {
    sku: "RB-038",
    name: "Full-Diamond Square Studded Earrings",
    unitPrice: 22,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "diamond",
    tags: ["diamond", "square", "studded", "sparkle"],
    images: [],
  },
  {
    sku: "RB-039",
    name: "French Elegant Palace Style Teardrop Pearl Earrings",
    unitPrice: 30,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "other",
    tags: ["french", "palace style", "teardrop", "pearl"],
    images: [],
  },
  {
    sku: "RB-040",
    name: "Contrast Color Water Ripple Geometric Square Earrings Mix Color",
    unitPrice: 35,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["contrast color", "water ripple", "geometric", "square"],
    images: [],
  },
  {
    sku: "RB-041",
    name: "Square Crystal Earrings Mix Color",
    unitPrice: 26,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "other",
    tags: ["crystal", "square", "elegant", "mix color"],
    images: [],
  },
  {
    sku: "RB-042",
    name: "Leaf Tassel Earrings Mix Color",
    unitPrice: 38,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["leaf", "tassel", "dangling", "mix color"],
    images: [],
  },
  {
    sku: "RB-043",
    name: "Twisted Heart-Shaped Earrings Golden",
    unitPrice: 16,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["twisted", "heart", "minimalist", "daily wear"],
    images: [],
  },
  {
    sku: "RB-044",
    name: "Forest Style Leaf Earrings Mix Color",
    unitPrice: 14,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["forest style", "leaf", "nature inspired", "mix color"],
    images: [],
  },
  {
    sku: "RB-045",
    name: "Retro French Geometric Cloud Earrings Mix Color",
    unitPrice: 13,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["retro", "french", "geometric", "cloud"],
    images: [],
  },
  {
    sku: "RB-046",
    name: "Teardrop Earrings Mix Color",
    unitPrice: 30,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["teardrop", "elegant", "dangling", "mix color"],
    images: [],
  },
  {
    sku: "RB-047",
    name: "Gold Silver Shell Earring",
    unitPrice: 28,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["shell", "ocean theme", "trendy", "dual tone"],
    images: [],
  },
  {
    sku: "RB-048",
    name: "Korean Pearl Fresh Flower Earrings",
    unitPrice: 26,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "other",
    tags: ["korean style", "pearl", "flower", "fresh"],
    images: [],
  },
  {
    sku: "RB-049",
    name: "Celebrity Pearl Earrings Mix Color",
    unitPrice: 35,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "other",
    tags: ["celebrity style", "pearl", "elegant", "mix color"],
    images: [],
  },
  {
    sku: "RB-050",
    name: "Retro Fashion Earrings",
    unitPrice: 19,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["retro", "fashion", "versatile", "daily wear"],
    images: [],
  },
  {
    sku: "RB-051",
    name: "Pearlescent Round Earring Mix Color",
    unitPrice: 30,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "other",
    tags: ["pearlescent", "round", "elegant", "mix color"],
    images: [],
  },
  {
    sku: "RB-052",
    name: "French Retro Oil Painting Texture Butterfly Geometric Earrings Mix Color",
    unitPrice: 27,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["french retro", "butterfly", "oil painting", "geometric"],
    images: [],
  },
  {
    sku: "RB-053",
    name: "Square Pearl Earrings",
    unitPrice: 17,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "other",
    tags: ["square", "pearl", "minimalist", "elegant"],
    images: [],
  },
  {
    sku: "RB-054",
    name: "Wrinkled Silk Flower Fashion Earrings Mix Color",
    unitPrice: 30,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["silk flower", "wrinkled texture", "fashion", "mix color"],
    images: [],
  },
  {
    sku: "RB-055",
    name: "Peach Heart Earrings Silver",
    unitPrice: 16,
    setQty: 6,
    productType: "earring",
    metal: "silver",
    stone: "none",
    tags: ["peach heart", "minimalist", "daily wear", "silver"],
    images: [],
  },
  {
    sku: "RB-056",
    name: "Four Pearl Earrings",
    unitPrice: 22,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "other",
    tags: ["pearl", "four pearl", "elegant", "classic"],
    images: [],
  },
  {
    sku: "RB-057",
    name: "French Flower Earrings Mix Color",
    unitPrice: 35,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["french style", "flower", "elegant", "mix color"],
    images: [],
  },
  {
    sku: "RB-058",
    name: "Trendy Personalized Four-Leaf Clover Oil Drop Earrings Mix Color",
    unitPrice: 21,
    setQty: 6,
    productType: "earring",
    metal: "gold",
    stone: "none",
    tags: ["four-leaf clover", "oil drop", "trendy", "personalized"],
    images: [],
  },
];

// --- Category definitions ---
const CATEGORIES = [
  {
    name: "Earrings",
    slug: "earrings",
    description: "Stunning earrings for every style and occasion",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Elegant necklaces and pendants for daily wear and gifting",
  },
  {
    name: "Rings",
    slug: "rings",
    description: "Beautiful anti-tarnish rings with unique designs",
  },
  {
    name: "Necklace Sets",
    slug: "necklace-sets",
    description: "Complete necklace and earring sets for a coordinated look",
  },
];

function getCategorySlug(productType: string): string {
  switch (productType) {
    case "earring": return "earrings";
    case "necklace": return "necklaces";
    case "finger ring": return "rings";
    case "jewelry set": return "necklace-sets";
    default: return "earrings";
  }
}

function generateShortDescription(name: string, productType: string): string {
  const typeLabel: Record<string, string> = {
    earring: "earrings",
    necklace: "necklace",
    "finger ring": "ring",
    "jewelry set": "necklace & earring set",
  };
  const label = typeLabel[productType] || "jewellery";
  const desc = `${name} - Premium quality ${label}, anti-tarnish finish, perfect for daily wear`;
  return desc.substring(0, 150);
}

function generateDescription(name: string, productType: string): string {
  const typeLabel: Record<string, string> = {
    earring: "earrings",
    necklace: "necklace",
    "finger ring": "ring",
    "jewelry set": "necklace and earring set",
  };
  const label = typeLabel[productType] || "jewellery piece";
  return `Beautiful ${label} with premium anti-tarnish finish. ${name}. Perfect for gifting and daily wear. High quality stainless steel material ensures lasting shine. Hypoallergenic and skin-friendly.`;
}

// --- Main Seed Function ---
async function seedAllProducts() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }

  const hasCloudinary =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinary) {
    console.warn("⚠️  Cloudinary credentials not found. Images will be stored with Shopify URLs directly.");
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  // Step 1: Create/find categories
  console.log("📁 Ensuring categories exist...");
  const categoryIds: Record<string, mongoose.Types.ObjectId> = {};

  for (const cat of CATEGORIES) {
    let existing = await Category.findOne({ slug: cat.slug });
    if (!existing) {
      existing = await Category.create({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: {
          url: "https://placehold.co/600x400?text=" + encodeURIComponent(cat.name),
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

  // Step 2: Seed products
  console.log("\n📦 Seeding all 58 products...\n");
  let created = 0;
  let skipped = 0;
  let imageUploads = 0;
  let imageFails = 0;
  const results: { sku: string; name: string; price: number; stock: number; hasImages: boolean }[] = [];

  for (const product of ALL_PRODUCTS) {
    // Idempotent: skip if SKU already exists
    const existing = await Product.findOne({ sku: product.sku });
    if (existing) {
      console.log(`  ⏭️  Skipped (exists): [${product.sku}] ${product.name}`);
      skipped++;
      continue;
    }

    // Calculate selling price
    const sellingPrice = calculateSellingPrice(product.unitPrice);
    const slug = generateSlug(product.name);
    const categorySlug = getCategorySlug(product.productType);
    const categoryId = categoryIds[categorySlug];

    if (!categoryId) {
      console.error(`  ❌ Category not found for: ${product.name} (type: ${product.productType})`);
      continue;
    }

    // Upload images to Cloudinary (if available and credentials exist)
    const productImages: { url: string; publicId: string }[] = [];

    if (product.images.length > 0 && hasCloudinary) {
      console.log(`  📤 Uploading ${product.images.length} image(s) for [${product.sku}]...`);
      for (let i = 0; i < product.images.length; i++) {
        const uploaded = await uploadToCloudinary(product.images[i], product.sku, i);
        if (uploaded) {
          productImages.push(uploaded);
          imageUploads++;
          console.log(`    ✅ Image ${i + 1} uploaded`);
        } else {
          // Fallback: store Shopify URL directly
          productImages.push({
            url: product.images[i],
            publicId: `${product.sku.toLowerCase()}-${i + 1}`,
          });
          imageFails++;
        }
        // Rate limit delay
        await delay(500);
      }
    } else if (product.images.length > 0 && !hasCloudinary) {
      // No Cloudinary - store Shopify URLs directly
      product.images.forEach((url, i) => {
        productImages.push({
          url,
          publicId: `${product.sku.toLowerCase()}-${i + 1}`,
        });
      });
    }

    // Determine if product should be active (only if it has images)
    const isActive = productImages.length > 0;

    // Create the product
    const newProduct = {
      name: product.name,
      slug,
      description: generateDescription(product.name, product.productType),
      shortDescription: generateShortDescription(product.name, product.productType),
      price: sellingPrice,
      category: categoryId,
      images: productImages,
      metal: product.metal,
      stone: product.stone,
      weight: 0,
      sku: product.sku,
      stock: product.setQty,
      featured: false,
      isActive,
      tags: product.tags,
      ratings: { average: 0, count: 0 },
    };

    try {
      await Product.create(newProduct);
      created++;
      results.push({
        sku: product.sku,
        name: product.name,
        price: sellingPrice,
        stock: product.setQty,
        hasImages: productImages.length > 0,
      });
      console.log(
        `  ✅ [${product.sku}] ${product.name} | ₹${sellingPrice} | Stock: ${product.setQty} | Images: ${productImages.length} | Active: ${isActive}`
      );
    } catch (err: any) {
      if (err.code === 11000) {
        console.log(`  ⏭️  Skipped (duplicate): [${product.sku}] ${product.name}`);
        skipped++;
      } else {
        console.error(`  ❌ Failed to create [${product.sku}] ${product.name}: ${err.message}`);
      }
    }
  }

  // Step 3: Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 SEED SUMMARY");
  console.log("=".repeat(60));
  console.log(`  Total products in script: ${ALL_PRODUCTS.length}`);
  console.log(`  Products created: ${created}`);
  console.log(`  Products skipped (already exist): ${skipped}`);
  console.log(`  Images uploaded to Cloudinary: ${imageUploads}`);
  console.log(`  Image upload failures: ${imageFails}`);
  console.log(`  Products with images (active): ${results.filter((r) => r.hasImages).length}`);
  console.log(`  Products without images (inactive): ${results.filter((r) => !r.hasImages).length}`);

  console.log("\n💰 PRICING TABLE:");
  console.log("-".repeat(60));
  console.log(
    `${"SKU".padEnd(8)} | ${"Name".padEnd(45)} | ${"Unit".padStart(5)} | ${"Sell".padStart(5)} | ${"Stk".padStart(3)}`
  );
  console.log("-".repeat(60));
  for (const product of ALL_PRODUCTS) {
    const sellingPrice = calculateSellingPrice(product.unitPrice);
    console.log(
      `${product.sku.padEnd(8)} | ${product.name.substring(0, 45).padEnd(45)} | ₹${product.unitPrice.toString().padStart(3)} | ₹${sellingPrice.toString().padStart(3)} | ${product.setQty.toString().padStart(3)}`
    );
  }

  // Total wholesale cost verification
  const totalWholesaleCost = ALL_PRODUCTS.reduce(
    (sum, p) => sum + p.unitPrice * p.setQty,
    0
  );
  console.log("-".repeat(60));
  console.log(`  Total wholesale cost: ₹${totalWholesaleCost}`);

  const totalSellingValue = ALL_PRODUCTS.reduce(
    (sum, p) => sum + calculateSellingPrice(p.unitPrice) * p.setQty,
    0
  );
  console.log(`  Total selling value: ₹${totalSellingValue}`);
  console.log(`  Potential profit: ₹${totalSellingValue - totalWholesaleCost}`);

  await mongoose.disconnect();
  console.log("\n✅ Done! All products seeded successfully.");
}

seedAllProducts().catch((err) => {
  console.error("❌ Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
