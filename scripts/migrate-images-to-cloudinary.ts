/**
 * Downloads product images from Shopify CDN and uploads them to Cloudinary.
 * Updates product records in MongoDB with new Cloudinary URLs.
 * 
 * Usage: npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node","esModuleInterop":true}' scripts/migrate-images-to-cloudinary.ts
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

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

async function uploadToCloudinary(imageUrl: string, folder: string, publicId: string): Promise<{ url: string; publicId: string } | null> {
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

async function migrate() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error("❌ Cloudinary credentials not found in .env");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  // Find all products with Shopify CDN images
  const products = await Product.find({
    "images.url": { $regex: /cdn\.shopify\.com/ },
  }).lean();

  console.log(`📦 Found ${products.length} products with Shopify images to migrate\n`);

  let totalImages = 0;
  let successCount = 0;
  let failCount = 0;

  for (const product of products) {
    const sku = (product as any).sku || "unknown";
    const name = (product as any).name || "Unknown";
    console.log(`\n🔄 Processing: ${name} (${sku})`);

    const images = (product as any).images || [];
    const newImages: { url: string; publicId: string }[] = [];
    let allSuccess = true;

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      totalImages++;

      // Skip if already on Cloudinary
      if (!img.url.includes("cdn.shopify.com")) {
        console.log(`    ✅ Image ${i + 1} already on Cloudinary`);
        newImages.push(img);
        successCount++;
        continue;
      }

      console.log(`    📤 Uploading image ${i + 1}/${images.length}...`);
      const uploaded = await uploadToCloudinary(
        img.url,
        sku.toLowerCase(),
        `${sku.toLowerCase()}-${i + 1}`
      );

      if (uploaded) {
        newImages.push(uploaded);
        successCount++;
        console.log(`    ✅ Done: ${uploaded.publicId}`);
      } else {
        // Keep original URL as fallback
        newImages.push(img);
        failCount++;
        allSuccess = false;
      }

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    }

    // Update product in DB
    await Product.updateOne(
      { _id: product._id },
      { $set: { images: newImages } }
    );
    console.log(`  ${allSuccess ? "✅" : "⚠️"} Updated product in DB`);
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 MIGRATION SUMMARY");
  console.log("=".repeat(50));
  console.log(`  Products processed: ${products.length}`);
  console.log(`  Total images: ${totalImages}`);
  console.log(`  Uploaded successfully: ${successCount}`);
  console.log(`  Failed: ${failCount}`);

  await mongoose.disconnect();
  console.log("\n✅ Done!");
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
