import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/radhe-boutique";

await mongoose.connect(MONGODB_URI);
console.log("✅ Connected to MongoDB:", MONGODB_URI.includes("localhost") ? "local" : "remote");

// Define schemas inline for the seed script
const categorySchema = new mongoose.Schema({
  name: String, slug: String, description: String,
  image: { url: String, publicId: String }, isActive: { type: Boolean, default: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String, slug: String, description: String, shortDescription: String,
  price: Number, salePrice: Number, category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  images: [{ url: String, publicId: String }], metal: String, stone: String,
  weight: Number, sku: String, stock: Number, featured: Boolean, isActive: Boolean,
  tags: [String], ratings: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true }, password: String,
  role: { type: String, default: "user" }, avatar: String, addresses: []
}, { timestamps: true });

const couponSchema = new mongoose.Schema({
  code: String, type: String, value: Number, minOrderValue: Number,
  maxUses: Number, usedCount: { type: Number, default: 0 }, expiresAt: Date, isActive: Boolean
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

// Clear existing data
await Category.deleteMany({});
await Product.deleteMany({});
await User.deleteMany({});
await Coupon.deleteMany({});
console.log("🗑️ Cleared existing data");

// Hash passwords using bcrypt
const bcrypt = await import("bcryptjs");
const adminPass = await bcrypt.default.hash("Admin@123", 10);
const userPass = await bcrypt.default.hash("Test@123", 10);

// Create users
await User.create({ name: "Admin User", email: "admin@radheboutique.com", password: adminPass, role: "admin" });
await User.create({ name: "Test User", email: "test@example.com", password: userPass, role: "user" });
console.log("👥 Users created");

// Create categories
const cats = await Category.insertMany([
  { name: "Rings", slug: "rings", description: "Exquisite rings crafted with precision", image: { url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800", publicId: "cat/rings" } },
  { name: "Necklaces", slug: "necklaces", description: "Statement necklaces that define sophistication", image: { url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", publicId: "cat/necklaces" } },
  { name: "Earrings", slug: "earrings", description: "Elegant earrings for every occasion", image: { url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800", publicId: "cat/earrings" } },
  { name: "Bracelets", slug: "bracelets", description: "Delicate bracelets that add grace", image: { url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800", publicId: "cat/bracelets" } },
  { name: "Sets", slug: "sets", description: "Complete jewellery sets for special moments", image: { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", publicId: "cat/sets" } },
]);
console.log("🏷️ 5 categories created");

const [rings, necklaces, earrings, bracelets, sets] = cats;

// Create products
await Product.insertMany([
  { name: "Eternal Rose Diamond Ring", slug: "eternal-rose-diamond-ring", shortDescription: "Brilliant-cut diamond solitaire in rose gold", description: "A breathtaking solitaire ring featuring a brilliant-cut diamond set in rose gold.", price: 45999, salePrice: 39999, category: rings._id, images: [{ url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800", publicId: "p/1" }], metal: "rose-gold", stone: "diamond", weight: 3.5, sku: "RNG-001", stock: 5, featured: true, isActive: true, tags: ["engagement", "diamond"], ratings: { average: 4.5, count: 12 } },
  { name: "Classic Gold Band", slug: "classic-gold-band", shortDescription: "22K gold band with floral engravings", description: "Timeless 22K gold band with intricate floral engravings.", price: 28999, category: rings._id, images: [{ url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800", publicId: "p/2" }], metal: "gold", stone: "none", weight: 4.2, sku: "RNG-002", stock: 8, featured: false, isActive: true, tags: ["wedding", "classic"], ratings: { average: 4.2, count: 8 } },
  { name: "Sapphire Halo Ring", slug: "sapphire-halo-ring", shortDescription: "Blue sapphire with diamond halo in platinum", description: "Stunning blue sapphire surrounded by a halo of diamonds set in platinum.", price: 89999, category: rings._id, images: [{ url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800", publicId: "p/3" }], metal: "platinum", stone: "sapphire", weight: 4.8, sku: "RNG-003", stock: 3, featured: true, isActive: true, tags: ["luxury", "sapphire"], ratings: { average: 4.8, count: 5 } },
  { name: "Celestial Gold Necklace", slug: "celestial-gold-necklace", shortDescription: "22K gold necklace with celestial motifs", description: "An elegant 22K gold necklace featuring star and moon motifs.", price: 52999, salePrice: 47999, category: necklaces._id, images: [{ url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800", publicId: "p/4" }], metal: "gold", stone: "none", weight: 12.5, sku: "NCK-001", stock: 4, featured: true, isActive: true, tags: ["celestial", "elegant"], ratings: { average: 4.6, count: 15 } },
  { name: "Diamond Pendant Necklace", slug: "diamond-pendant-necklace", shortDescription: "Diamond cluster pendant in white gold", description: "Sophisticated pendant featuring a cluster of diamonds.", price: 67999, category: necklaces._id, images: [{ url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800", publicId: "p/5" }], metal: "platinum", stone: "diamond", weight: 8.3, sku: "NCK-002", stock: 6, featured: false, isActive: true, tags: ["diamond", "pendant"], ratings: { average: 4.3, count: 7 } },
  { name: "Ruby Statement Necklace", slug: "ruby-statement-necklace", shortDescription: "Ruby and gold statement necklace", description: "Bold statement necklace featuring oval-cut rubies and gold work.", price: 125999, category: necklaces._id, images: [{ url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", publicId: "p/6" }], metal: "gold", stone: "ruby", weight: 35.6, sku: "NCK-003", stock: 2, featured: true, isActive: true, tags: ["ruby", "bridal"], ratings: { average: 4.9, count: 3 } },
  { name: "Diamond Stud Earrings", slug: "diamond-stud-earrings", shortDescription: "Classic diamond studs in platinum", description: "Classic diamond studs set in platinum.", price: 38999, salePrice: 34999, category: earrings._id, images: [{ url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800", publicId: "p/7" }], metal: "platinum", stone: "diamond", weight: 2.4, sku: "EAR-001", stock: 10, featured: true, isActive: true, tags: ["diamond", "studs"], ratings: { average: 4.7, count: 20 } },
  { name: "Emerald Drop Earrings", slug: "emerald-drop-earrings", shortDescription: "Emerald drop earrings in gold", description: "Elegant drop earrings featuring emerald stones in gold.", price: 44999, category: earrings._id, images: [{ url: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800", publicId: "p/8" }], metal: "gold", stone: "emerald", weight: 5.1, sku: "EAR-002", stock: 7, featured: false, isActive: true, tags: ["emerald", "drops"], ratings: { average: 4.4, count: 9 } },
  { name: "Rose Gold Hoops", slug: "rose-gold-hoops", shortDescription: "Polished rose gold hoop earrings", description: "Contemporary hoop earrings in rose gold with polished finish.", price: 18999, category: earrings._id, images: [{ url: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800", publicId: "p/9" }], metal: "rose-gold", stone: "none", weight: 3.8, sku: "EAR-003", stock: 12, featured: false, isActive: true, tags: ["hoops", "rose-gold"], ratings: { average: 4.1, count: 14 } },
  { name: "Diamond Tennis Bracelet", slug: "diamond-tennis-bracelet", shortDescription: "Platinum diamond tennis bracelet", description: "Luxurious tennis bracelet featuring a continuous line of diamonds.", price: 145999, category: bracelets._id, images: [{ url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800", publicId: "p/10" }], metal: "platinum", stone: "diamond", weight: 15.2, sku: "BRC-001", stock: 3, featured: true, isActive: true, tags: ["diamond", "tennis"], ratings: { average: 4.9, count: 4 } },
  { name: "Gold Chain Bracelet", slug: "gold-chain-bracelet", shortDescription: "Delicate adjustable gold chain", description: "Delicate gold chain bracelet with adjustable length.", price: 22999, category: bracelets._id, images: [{ url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800", publicId: "p/11" }], metal: "gold", stone: "none", weight: 5.6, sku: "BRC-002", stock: 9, featured: false, isActive: true, tags: ["chain", "minimalist"], ratings: { average: 4.0, count: 11 } },
  { name: "Bridal Diamond Set", slug: "bridal-diamond-set", shortDescription: "Complete diamond & ruby bridal set", description: "Complete bridal set including necklace, earrings, and ring.", price: 299999, category: sets._id, images: [{ url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800", publicId: "p/12" }], metal: "gold", stone: "diamond", weight: 65.4, sku: "SET-001", stock: 2, featured: true, isActive: true, tags: ["bridal", "diamond"], ratings: { average: 5.0, count: 2 } },
  { name: "Everyday Elegance Set", slug: "everyday-elegance-set", shortDescription: "Rose gold necklace & earring set", description: "Matching necklace and earrings in rose gold.", price: 54999, category: sets._id, images: [{ url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800", publicId: "p/13" }], metal: "rose-gold", stone: "diamond", weight: 12.8, sku: "SET-002", stock: 5, featured: false, isActive: true, tags: ["everyday", "set"], ratings: { average: 4.3, count: 6 } },
  { name: "Traditional Temple Set", slug: "traditional-temple-set", shortDescription: "Traditional gold temple jewellery set", description: "Traditional temple jewellery set in gold with deity motifs.", price: 189999, category: sets._id, images: [{ url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800", publicId: "p/14" }], metal: "gold", stone: "ruby", weight: 85.3, sku: "SET-003", stock: 1, featured: false, isActive: true, tags: ["traditional", "temple"], ratings: { average: 4.6, count: 3 } },
  { name: "Silver Charm Bracelet", slug: "silver-charm-bracelet", shortDescription: "Sterling silver bracelet with charms", description: "A beautiful sterling silver bracelet with dangling heart charms.", price: 12999, category: bracelets._id, images: [{ url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800", publicId: "p/15" }], metal: "silver", stone: "none", weight: 8.1, sku: "BRC-003", stock: 15, featured: false, isActive: true, tags: ["silver", "charm"], ratings: { average: 4.2, count: 18 } },
]);
console.log("💎 15 products created");

// Create coupons
await Coupon.insertMany([
  { code: "WELCOME10", type: "percentage", value: 10, minOrderValue: 10000, maxUses: 100, expiresAt: new Date("2025-12-31"), isActive: true },
  { code: "FESTIVE2024", type: "flat", value: 5000, minOrderValue: 50000, maxUses: 50, expiresAt: new Date("2025-12-31"), isActive: true },
]);
console.log("🎫 2 coupons created");

console.log("\n🎉 Database seeded successfully!");
console.log("👤 Admin: admin@radheboutique.com / Admin@123");
console.log("👤 User: test@example.com / Test@123");

await mongoose.disconnect();
process.exit(0);
