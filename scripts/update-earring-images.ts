/**
 * Updates earring products in DB with images from Shopify collection data.
 * - Finds inactive products with SKU starting with "RB-"
 * - Matches them to Shopify earrings by total price (unitPrice * setQty) and name keywords
 * - Uploads Shopify images to Cloudinary
 * - Updates product in DB with new image URLs and sets isActive: true
 *
 * Usage: npx ts-node --compiler-options '{"module":"commonjs","moduleResolution":"node","esModuleInterop":true}' scripts/update-earring-images.ts
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

// --- Shopify earrings collection data ---
interface ShopifyEarring {
  code: string;
  title: string;
  price: number;
  images: string[];
}

const shopifyEarrings: ShopifyEarring[] = [
  {
    code: "SJ133",
    title: "Leaf tassel earring (Mix color)",
    price: 228,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN0107Z0bH1vr6KmXS3tn__1592666225-0-cib_7f397ca9-0dd6-4035-95b5-37ed36ada700.jpg?v=1756476800",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01pnuXGQ1vr6KloRkh9__1592666225-0-cib_3096a330-9b7a-46f0-ab7a-e6496439dd6a.jpg?v=1756476800",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01CL6qD41vr6KkGIPg8__1592666225-0-cib.jpg?v=1756476800",
    ],
  },
  {
    code: "SJ186",
    title: "Twisted heart-shaped earrings - Golden",
    price: 96,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01OmrVzc1vr6IDDmRUd__1592666225-0-cib_57fa427c-d794-42d1-8591-c28014ef50bb.jpg?v=1756476875",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN016Mck921vr6I7gBGqp__1592666225-0-cib_7292c603-2f5d-4c0c-b86a-450547e10423.jpg?v=1756476875",
    ],
  },
  {
    code: "SJ260",
    title: "Forest Style Leaf Earrings (Mix Color)",
    price: 84,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01Kcacg61vr6RBOJ0S3__1592666225-0-cib_3b718613-a49b-4c34-a873-70cd456db9e0.jpg?v=1767951596",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01jbMEFs1vr6RBOJg5Q__1592666225-0-cib_4fee8691-8bd0-4ce7-8b7b-3d5979ad6aea.jpg?v=1767951596",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN017aWgaE1vr6RmLePd6__1592666225-0-cib_0174f78b-975a-406c-8158-37393df781c9.jpg?v=1767951597",
    ],
  },
  {
    code: "SJ142",
    title: "Retro French Geometric Cloud Earrings (Mix Color)",
    price: 78,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01BekQQS1vr6aSj3Z3X__1592666225-0-cib.jpg?v=1767951547",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01rNawfj1vr6aTFlxyC__1592666225-0-cib.jpg?v=1767951547",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01V6a4NM1vr6aUBWOo2__1592666225-0-cib.jpg?v=1767951547",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01fxTLRD1vr6aSlTnrg__1592666225-0-cib.jpg?v=1767951547",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01EYRYvr1vr6aTIexEu__1592666225-0-cib.jpg?v=1767951547",
    ],
  },
  {
    code: "SJ121",
    title: "Gold Silver Shell Earring",
    price: 168,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01zwlrEI1vr6PmzRvHK__1592666225-0-cib_61fcdf23-5e41-4ab6-9008-7a930380e1dc.jpg?v=1756476782",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN0164Tr321vr6Pk5MeSd__1592666225-0-cib_52aef50a-1b92-4752-88cd-bad2961f180a.jpg?v=1756476782",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01LmVDHS1vr6PWiVXgn__1592666225-0-cib_3d16eebb-fe94-4136-b563-e28670b42477.jpg?v=1756476782",
    ],
  },
  {
    code: "SJ255",
    title: "Teardrop earrings (Mix Color)",
    price: 180,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN016Xp3Dn1vr6QjWmn09__1592666225-0-cib.jpg?v=1756476980",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01MRAawZ1vr6UXeVduA__1592666225-0-cib_289693d4-3c4c-4b1c-80c9-94fa4029e9e1.jpg?v=1756476980",
    ],
  },
  {
    code: "SJ11",
    title: "Korean pearl fresh flower earrings",
    price: 156,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01opubI01vr6YvekjUX__1592666225-0-cib.jpg?v=1756476608",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01UzqQ8h1vr6Yv7oaKq__1592666225-0-cib.jpg?v=1756476608",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01AX5hyM1vr6YuvhYlA__1592666225-0-cib.jpg?v=1756476608",
    ],
  },
  {
    code: "SJ281",
    title: "Celebrity pearl earrings (Mix Color)",
    price: 210,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/20567394033_1950307735.jpg?v=1756477021",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/20567373470_1950307735.jpg?v=1756477020",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/20642707150_1950307735.jpg?v=1756477021",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/20723921504_1950307735_2d6ea335-c68c-42f0-ba11-f7c3bf2aba9a.jpg?v=1756477021",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/20642710089_1950307735_56320151-7b7b-413f-bcda-31206df74ee5.jpg?v=1756477021",
    ],
  },
  {
    code: "SJ183",
    title: "Square crystal earrings (Mix color)",
    price: 156,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01aOoRAY1vr6Z5acdur__1592666225-0-cib.jpg?v=1756476871",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01fc40bI1vr6WY402fP__1592666225-0-cib.jpg?v=1756476871",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01lXIIJj1vr6Z6z445l__1592666225-0-cib.jpg?v=1756476871",
    ],
  },
  {
    code: "SJ124",
    title: "Contrast color water ripple geometric square earrings (Mix color)",
    price: 210,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01xT7P5E1vr6QZEJs4O__1592666225-0-cib_c58f2dd5-1b45-43ad-b84e-734eae4b2dcc.jpg?v=1756476786",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01VxwAFN1vr6Se96nxl__1592666225-0-cib_ae703028-bf4a-4962-b03d-dc6762132ed3.jpg?v=1756476786",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN016ZbtsX1vr6Scet5Tf__1592666225-0-cib_0a30caa7-5de8-4993-8902-8a0aec79a3cd.jpg?v=1756476786",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01kdrCj11vr6SbI9GGt__1592666225-0-cib.jpg?v=1756476787",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01ccpZ9C1vr6Tww3Lxs__1592666225-0-cib.jpg?v=1756476786",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN012xZhzv1vr6U08G3sp__1592666225-0-cib.jpg?v=1756476786",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN0124OIja1vr6WsMOK9M__1592666225-0-cib.jpg?v=1756476786",
    ],
  },
  {
    code: "SJ14",
    title: "French elegant palace style teardrop pearl earrings",
    price: 180,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01CBcuUC1vr6YpSxbOj__1592666225-0-cib.jpg?v=1756476612",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01hedh2n1vr6YoMAkLw__1592666225-0-cib.jpg?v=1756476613",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01aE0qCR1vr6YlthF6l__1592666225-0-cib.jpg?v=1756476612",
    ],
  },
  {
    code: "SJ257",
    title: "Korean tulip fashion earring (Mix Color)",
    price: 114,
    images: [
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01KIU7781vr6IdD8POt__1592666225-0-cib_0700a61f-9728-4e02-8de2-331b72ef2d13.jpg?v=1756476984",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN012r7JS91vr6M1syQQv__1592666225-0-cib_ae1f4409-5343-45cf-9979-e729d4d88c3f.jpg?v=1756476984",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN011QLMfa1vr6M0pOxoV__1592666225-0-cib_a1a22bc0-0975-4007-8bdb-66292e884a80.jpg?v=1756476983",
      "https://cdn.shopify.com/s/files/1/0648/1186/0135/files/O1CN01eCuydq1vr6M0p8zKp__1592666225-0-cib_581b4069-978a-40db-8cea-e2077003224b.jpg?v=1756476983",
    ],
  },
];

// --- Hardcoded matching map: DB SKU -> Shopify code + keywords for disambiguation ---
interface MatchEntry {
  sku: string;
  shopifyCode: string;
  keywords: string[]; // for disambiguation when prices collide
}

const matchMap: MatchEntry[] = [
  { sku: "RB-042", shopifyCode: "SJ133", keywords: ["leaf", "tassel"] },
  { sku: "RB-043", shopifyCode: "SJ186", keywords: ["twisted", "heart"] },
  { sku: "RB-044", shopifyCode: "SJ260", keywords: ["forest", "leaf"] },
  { sku: "RB-045", shopifyCode: "SJ142", keywords: ["geometric", "cloud"] },
  { sku: "RB-046", shopifyCode: "SJ255", keywords: ["teardrop"] },
  { sku: "RB-047", shopifyCode: "SJ121", keywords: ["shell"] },
  { sku: "RB-048", shopifyCode: "SJ11", keywords: ["pearl", "flower"] },
  { sku: "RB-049", shopifyCode: "SJ281", keywords: ["celebrity", "pearl"] },
  { sku: "RB-050", shopifyCode: "SJ257", keywords: ["fashion", "tulip"] },
  { sku: "RB-041", shopifyCode: "SJ183", keywords: ["square", "crystal"] },
  { sku: "RB-040", shopifyCode: "SJ124", keywords: ["contrast", "water", "ripple"] },
  { sku: "RB-039", shopifyCode: "SJ14", keywords: ["french", "palace", "pearl"] },
];

// --- Upload helper ---
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
    console.error(`    ❌ Upload failed: ${error.message}`);
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Main ---
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

  // Step 1: Find all inactive products with SKU starting with "RB-"
  const inactiveProducts = await Product.find({
    isActive: false,
    sku: { $regex: /^RB-/ },
  }).lean();

  console.log(`📦 Found ${inactiveProducts.length} inactive RB- products\n`);

  if (inactiveProducts.length === 0) {
    console.log("No inactive RB- products found. Exiting.");
    await mongoose.disconnect();
    return;
  }

  // Step 2: Match and process
  let matchedCount = 0;
  let uploadedImages = 0;
  let failedImages = 0;
  let activatedCount = 0;

  for (const match of matchMap) {
    // Find the DB product by SKU
    const dbProduct = inactiveProducts.find((p: any) => p.sku === match.sku);
    if (!dbProduct) {
      console.log(`⏭️  SKU ${match.sku} not found in inactive products (may already be active). Skipping.`);
      continue;
    }

    // Find the Shopify earring by code
    const shopifyProduct = shopifyEarrings.find((s) => s.code === match.shopifyCode);
    if (!shopifyProduct) {
      console.log(`⏭️  Shopify code ${match.shopifyCode} not found in data. Skipping.`);
      continue;
    }

    // Verify price match
    const dbTotalPrice = ((dbProduct as any).unitPrice || 0) * ((dbProduct as any).setQty || 1);
    if (dbTotalPrice !== shopifyProduct.price) {
      console.log(`⚠️  Price mismatch for ${match.sku}: DB total=${dbTotalPrice}, Shopify=${shopifyProduct.price}. Proceeding anyway (hardcoded match).`);
    }

    matchedCount++;
    console.log(`\n🔄 [${matchedCount}/12] Processing ${match.sku} -> ${match.shopifyCode}`);
    console.log(`   DB: ${(dbProduct as any).name} (total: ₹${dbTotalPrice})`);
    console.log(`   Shopify: ${shopifyProduct.title} (₹${shopifyProduct.price})`);
    console.log(`   Images to upload: ${shopifyProduct.images.length}`);

    // Step 3: Upload images to Cloudinary
    const newImages: { url: string; publicId: string }[] = [];
    const skuLower = match.sku.toLowerCase();

    for (let i = 0; i < shopifyProduct.images.length; i++) {
      const imageUrl = shopifyProduct.images[i];
      console.log(`   📤 Uploading image ${i + 1}/${shopifyProduct.images.length}...`);

      const uploaded = await uploadToCloudinary(
        imageUrl,
        skuLower,
        `${skuLower}-${i + 1}`
      );

      if (uploaded) {
        newImages.push(uploaded);
        uploadedImages++;
        console.log(`   ✅ Done: ${uploaded.publicId}`);
      } else {
        failedImages++;
      }

      // 500ms delay between uploads
      await delay(500);
    }

    // Step 4: Update product in DB
    if (newImages.length > 0) {
      await Product.updateOne(
        { _id: (dbProduct as any)._id },
        {
          $set: {
            images: newImages,
            isActive: true,
          },
        }
      );
      activatedCount++;
      console.log(`   ✅ Updated ${match.sku} in DB - ${newImages.length} images, isActive: true`);
    } else {
      console.log(`   ⚠️  No images uploaded for ${match.sku}, skipping DB update`);
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 UPDATE SUMMARY");
  console.log("=".repeat(50));
  console.log(`  Products matched: ${matchedCount}`);
  console.log(`  Products activated: ${activatedCount}`);
  console.log(`  Images uploaded: ${uploadedImages}`);
  console.log(`  Images failed: ${failedImages}`);
  console.log("=".repeat(50));

  await mongoose.disconnect();
  console.log("\n✅ Done! Earring images updated successfully.");
}

main().catch((err) => {
  console.error("❌ Script failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
