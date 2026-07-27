/**
 * Fetches product data from jewellerywholesalersindia.com for specific handle ranges,
 * matches them against 32 inactive products in our DB by price + keyword matching,
 * uploads images to Cloudinary, and updates the matched products.
 *
 * Usage: npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node","esModuleInterop":true}' scripts/fetch-remaining-products.ts
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

// --- Product Schema (flexible for querying) ---
const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// --- Inactive products we're looking for ---
interface InactiveProduct {
  sku: string;
  totalPrice: number;
  keywords: string[];
  type: string;
  description: string;
}

const inactiveProducts: InactiveProduct[] = [
  { sku: "RB-005", totalPrice: 138, keywords: ["v-shaped"], type: "ring", description: "V-Shaped Ring Gold" },
  { sku: "RB-007", totalPrice: 138, keywords: ["winding", "multi"], type: "ring", description: "Multi-Layered Winding Ring Gold" },
  { sku: "RB-008", totalPrice: 210, keywords: ["bow necklace"], type: "necklace", description: "Bow Necklace Gold" },
  { sku: "RB-009", totalPrice: 228, keywords: ["leaves necklace"], type: "necklace", description: "Leaves Necklace Gold" },
  { sku: "RB-010", totalPrice: 165, keywords: ["ball bead"], type: "necklace", description: "Ball Bead Chain Necklace" },
  { sku: "RB-011", totalPrice: 174, keywords: ["heart", "necklace", "silver"], type: "necklace", description: "Heart-Shaped Necklace Silver" },
  { sku: "RB-012", totalPrice: 201, keywords: ["diamond drop"], type: "necklace", description: "Diamond Drop Necklace" },
  { sku: "RB-013", totalPrice: 138, keywords: ["round link"], type: "necklace", description: "Round Link Chain Drop-Shaped Necklace Silver" },
  { sku: "RB-014", totalPrice: 174, keywords: ["cross pearl"], type: "necklace", description: "Cross Pearl Necklace" },
  { sku: "RB-015", totalPrice: 210, keywords: ["shell necklace"], type: "necklace", description: "Shell Necklace Gold" },
  { sku: "RB-016", totalPrice: 228, keywords: ["square", "shell"], type: "necklace", description: "Square Black Shell Necklace" },
  { sku: "RB-017", totalPrice: 267, keywords: ["seven pearl"], type: "necklace", description: "Seven Pearls Necklace" },
  { sku: "RB-025", totalPrice: 261, keywords: ["zircon bow"], type: "jewelry set", description: "Zircon Bow Earring Necklace Set" },
  { sku: "RB-028", totalPrice: 228, keywords: ["leaves petals"], type: "earring", description: "Fashion Leaves Petals Earrings" },
  { sku: "RB-029", totalPrice: 180, keywords: ["irregular square"], type: "earring", description: "Retro Irregular Square Earrings" },
  { sku: "RB-030", totalPrice: 162, keywords: ["hollow water drop"], type: "earring", description: "Hollow Water Drop Minimalist Earrings" },
  { sku: "RB-031", totalPrice: 198, keywords: ["velvet flower"], type: "earring", description: "Velvet Flower Earrings" },
  { sku: "RB-032", totalPrice: 108, keywords: ["hollow drop"], type: "earring", description: "Hollow Drop Earrings Silver" },
  { sku: "RB-033", totalPrice: 72, keywords: ["u-shaped", "silver"], type: "earring", description: "Geometric U-Shaped Earrings Silver" },
  { sku: "RB-034", totalPrice: 138, keywords: ["square", "fashionable"], type: "earring", description: "Square Style Fashionable Earrings Black" },
  { sku: "RB-035", totalPrice: 72, keywords: ["u-shaped", "golden"], type: "earring", description: "Geometric U-Shaped Earrings Golden" },
  { sku: "RB-036", totalPrice: 198, keywords: ["camellia"], type: "earring", description: "Camellia Earrings" },
  { sku: "RB-037", totalPrice: 156, keywords: ["rhinestones pearl"], type: "earring", description: "Rhinestones Pearl Earrings" },
  { sku: "RB-038", totalPrice: 132, keywords: ["diamond square studded"], type: "earring", description: "Full-Diamond Square Studded" },
  { sku: "RB-051", totalPrice: 180, keywords: ["pearlescent round"], type: "earring", description: "Pearlescent Round Earring" },
  { sku: "RB-052", totalPrice: 162, keywords: ["oil painting", "butterfly"], type: "earring", description: "French Retro Oil Painting Butterfly" },
  { sku: "RB-053", totalPrice: 102, keywords: ["square pearl"], type: "earring", description: "Square Pearl Earrings" },
  { sku: "RB-054", totalPrice: 180, keywords: ["wrinkled silk"], type: "earring", description: "Wrinkled Silk Flower" },
  { sku: "RB-055", totalPrice: 96, keywords: ["peach heart"], type: "earring", description: "Peach Heart Earrings Silver" },
  { sku: "RB-056", totalPrice: 132, keywords: ["four pearl"], type: "earring", description: "Four Pearl Earrings" },
  { sku: "RB-057", totalPrice: 210, keywords: ["french flower"], type: "earring", description: "French Flower Earrings" },
  { sku: "RB-058", totalPrice: 126, keywords: ["four-leaf", "oil drop"], type: "earring", description: "Four-Leaf Clover Oil Drop" },
];

// --- Helper: Check if title matches keywords ---
function matchesKeywords(title: string, keywords: string[]): boolean {
  const titleLower = title.toLowerCase();
  // All keywords must be present in the title
  return keywords.every((kw) => titleLower.includes(kw.toLowerCase()));
}

// --- Helper: Extract price from Shopify product JSON ---
function extractPrice(shopifyProduct: any): number {
  // Shopify product JSON has variants with prices as strings like "138.00"
  const variants = shopifyProduct.variants || [];
  if (variants.length > 0) {
    return parseFloat(variants[0].price);
  }
  return 0;
}

// --- Helper: Extract images from Shopify product JSON ---
function extractImages(shopifyProduct: any): string[] {
  const images = shopifyProduct.images || [];
  return images.map((img: any) => img.src);
}

// --- Helper: Upload to Cloudinary ---
async function uploadToCloudinary(
  imageUrl: string,
  folder: string,
  publicId: string
): Promise<{ url: string; publicId: string } | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: `radhe-boutique/products/${folder}`,
      public_id: publicId,
      resource_type: "auto",
      transformation: [
        { width: 1200, height: 1200, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.error(`    ❌ Failed to upload: ${error.message}`);
    return null;
  }
}

// --- Helper: Generate handles to fetch ---
function generateHandles(): string[] {
  const handles: string[] = [];

  // yj230 through yj255
  for (let i = 230; i <= 255; i++) {
    handles.push(`yj${i}`);
  }

  // sj280 through sj350
  for (let i = 280; i <= 350; i++) {
    handles.push(`sj${i}`);
  }

  return handles;
}

// --- Helper: Fetch product JSON from Shopify ---
async function fetchProductByHandle(handle: string): Promise<any | null> {
  const url = `https://jewellerywholesalersindia.com/products/${handle}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null; // 404 or other error - handle doesn't exist
    }
    const data = await response.json();
    return data.product || null;
  } catch (error: any) {
    // Silently skip network errors
    return null;
  }
}

// --- Helper: Find matching inactive product ---
function findMatch(
  shopifyProduct: any,
  unmatchedProducts: InactiveProduct[]
): InactiveProduct | null {
  const price = extractPrice(shopifyProduct);
  const title = shopifyProduct.title || "";

  // First filter by price match
  const priceMatches = unmatchedProducts.filter((p) => p.totalPrice === price);

  if (priceMatches.length === 0) return null;

  // Then check keywords
  for (const candidate of priceMatches) {
    if (matchesKeywords(title, candidate.keywords)) {
      return candidate;
    }
  }

  return null;
}

// --- Helper: Calculate selling price (same formula as seed script) ---
function calculateSellingPrice(unitPrice: number): number {
  const costPrice = unitPrice + 2;
  const doubled = costPrice * 2;
  const lastDigit = doubled % 10;
  if (lastDigit <= 9) {
    return doubled + (9 - lastDigit);
  }
  return doubled + 9;
}

// --- Main function ---
async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("❌ Cloudinary credentials not found in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  const handles = generateHandles();
  console.log(`📋 Will fetch ${handles.length} handles (yj230-yj255, sj280-sj350)\n`);

  const unmatched = [...inactiveProducts]; // Track which ones we haven't matched yet
  const matches: Array<{
    handle: string;
    sku: string;
    shopifyTitle: string;
    ourDescription: string;
    price: number;
    images: string[];
  }> = [];
  const foundProducts: Array<{ handle: string; title: string; price: number }> = [];

  // Fetch each handle
  for (const handle of handles) {
    process.stdout.write(`  Fetching ${handle}...`);

    const product = await fetchProductByHandle(handle);

    if (!product) {
      process.stdout.write(" ❌ Not found\n");
      // Small delay to be nice to the server
      await new Promise((r) => setTimeout(r, 300));
      continue;
    }

    const title = product.title || "Unknown";
    const price = extractPrice(product);
    process.stdout.write(` ✅ "${title}" (₹${price})\n`);
    foundProducts.push({ handle, title, price });

    // Try to match
    const match = findMatch(product, unmatched);
    if (match) {
      const images = extractImages(product);
      console.log(`    🎯 MATCHED -> ${match.sku} (${match.description})`);
      matches.push({
        handle,
        sku: match.sku,
        shopifyTitle: title,
        ourDescription: match.description,
        price,
        images,
      });
      // Remove from unmatched list
      const idx = unmatched.findIndex((p) => p.sku === match.sku);
      if (idx !== -1) unmatched.splice(idx, 1);
    }

    // Rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  // --- Summary of fetching phase ---
  console.log("\n" + "=".repeat(60));
  console.log("📊 FETCH RESULTS");
  console.log("=".repeat(60));
  console.log(`  Handles checked: ${handles.length}`);
  console.log(`  Products found: ${foundProducts.length}`);
  console.log(`  Matches found: ${matches.length}`);
  console.log(`  Still unmatched: ${unmatched.length}`);

  if (matches.length === 0) {
    console.log("\n⚠️  No matches found. Nothing to update.");
    await mongoose.disconnect();
    return;
  }

  // --- Upload images and update DB ---
  console.log("\n" + "=".repeat(60));
  console.log("📤 UPLOADING IMAGES & UPDATING DB");
  console.log("=".repeat(60));

  let updatedCount = 0;
  let failedCount = 0;

  for (const match of matches) {
    console.log(`\n🔄 Processing ${match.sku} (${match.ourDescription})`);
    console.log(`   Source: ${match.handle} -> "${match.shopifyTitle}"`);

    // Find the product in DB by SKU
    const dbProduct = await Product.findOne({ sku: match.sku });
    if (!dbProduct) {
      console.log(`   ❌ Product ${match.sku} not found in DB, skipping`);
      failedCount++;
      continue;
    }

    // Upload images to Cloudinary
    const cloudinaryImages: { url: string; publicId: string }[] = [];
    for (let i = 0; i < match.images.length; i++) {
      console.log(`   📤 Uploading image ${i + 1}/${match.images.length}...`);
      const uploaded = await uploadToCloudinary(
        match.images[i],
        match.sku.toLowerCase(),
        `${match.sku.toLowerCase()}-${i + 1}`
      );
      if (uploaded) {
        cloudinaryImages.push(uploaded);
        console.log(`   ✅ Uploaded: ${uploaded.publicId}`);
      } else {
        // Fallback: use original Shopify URL
        cloudinaryImages.push({
          url: match.images[i],
          publicId: `${match.sku.toLowerCase()}-${i + 1}`,
        });
        console.log(`   ⚠️  Using original URL as fallback`);
      }
      await new Promise((r) => setTimeout(r, 500)); // Rate limit
    }

    // Update product in DB
    const updateData: any = {
      images: cloudinaryImages,
      isActive: true,
    };

    await Product.updateOne({ _id: dbProduct._id }, { $set: updateData });
    console.log(`   ✅ Updated ${match.sku} - now active with ${cloudinaryImages.length} images`);
    updatedCount++;
  }

  // --- Final Summary ---
  console.log("\n" + "=".repeat(60));
  console.log("📊 FINAL SUMMARY");
  console.log("=".repeat(60));
  console.log(`  Total matches: ${matches.length}`);
  console.log(`  Successfully updated: ${updatedCount}`);
  console.log(`  Failed to update: ${failedCount}`);

  if (matches.length > 0) {
    console.log("\n  MATCHED PRODUCTS:");
    console.log("  " + "-".repeat(56));
    for (const m of matches) {
      console.log(`  ${m.sku.padEnd(8)} <- ${m.handle.padEnd(6)} | ₹${m.price} | "${m.shopifyTitle}"`);
    }
  }

  if (unmatched.length > 0) {
    console.log("\n  STILL UNMATCHED (need manual investigation):");
    console.log("  " + "-".repeat(56));
    for (const u of unmatched) {
      console.log(`  ${u.sku.padEnd(8)} | ₹${u.totalPrice} | ${u.description}`);
    }
  }

  if (foundProducts.length > 0) {
    console.log("\n  ALL FOUND PRODUCTS (for reference):");
    console.log("  " + "-".repeat(56));
    for (const p of foundProducts) {
      const wasMatched = matches.some((m) => m.handle === p.handle);
      const marker = wasMatched ? "✅" : "❓";
      console.log(`  ${marker} ${p.handle.padEnd(6)} | ₹${p.price} | "${p.title}"`);
    }
  }

  await mongoose.disconnect();
  console.log("\n✅ Done!");
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
