import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

import connectDB from "../lib/db";
import User from "../models/User";
import Category from "../models/Category";
import Product from "../models/Product";
import Coupon from "../models/Coupon";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    description: "Exquisite rings crafted with precision and elegance",
    image: {
      url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
      publicId: "categories/rings",
    },
    isActive: true,
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Statement necklaces that define sophistication",
    image: {
      url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
      publicId: "categories/necklaces",
    },
    isActive: true,
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Elegant earrings for every occasion",
    image: {
      url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800",
      publicId: "categories/earrings",
    },
    isActive: true,
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Delicate bracelets that add a touch of grace",
    image: {
      url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
      publicId: "categories/bracelets",
    },
    isActive: true,
  },
  {
    name: "Sets",
    slug: "sets",
    description: "Complete jewellery sets for special moments",
    image: {
      url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
      publicId: "categories/sets",
    },
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    await connectDB();

    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});

    console.log("👥 Creating users...");
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@radheboutique.com",
      password: "Admin@123",
      role: "admin",
    });

    const testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "Test@123",
      role: "user",
    });

    console.log("✅ Users created:", adminUser.email, testUser.email);

    console.log("🏷️  Creating categories...");
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories created`);

    const [rings, necklaces, earrings, bracelets, sets] = createdCategories;

    console.log("💎 Creating products...");
    const products = [
      // Rings
      {
        name: "Eternal Rose Diamond Ring",
        description:
          "A breathtaking solitaire ring featuring a brilliant-cut diamond set in rose gold. The delicate band enhances the diamond's sparkle, making it perfect for engagements or special occasions. Crafted with precision and certified for authenticity.",
        shortDescription: "Brilliant-cut diamond solitaire in rose gold",
        price: 45999,
        salePrice: 39999,
        category: rings._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200",
            publicId: "products/ring-1",
          },
        ],
        metal: "rose-gold",
        stone: "diamond",
        weight: 3.5,
        sku: "RNG-001",
        stock: 5,
        featured: true,
        isActive: true,
        tags: ["engagement", "diamond", "solitaire"],
      },
      {
        name: "Classic Gold Band",
        description:
          "Timeless 22K gold band with intricate floral engravings. Perfect for weddings or as an everyday piece. The band showcases traditional craftsmanship with a modern finish.",
        shortDescription: "22K gold band with floral engravings",
        price: 28999,
        category: rings._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200",
            publicId: "products/ring-2",
          },
        ],
        metal: "gold",
        stone: "none",
        weight: 4.2,
        sku: "RNG-002",
        stock: 8,
        featured: false,
        isActive: true,
        tags: ["wedding", "classic", "traditional"],
      },
      {
        name: "Sapphire Halo Ring",
        description:
          "Stunning blue sapphire surrounded by a halo of diamonds set in platinum. The intricate design captures light beautifully, making it a statement piece for any collection.",
        shortDescription: "Blue sapphire with diamond halo in platinum",
        price: 89999,
        category: rings._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1200",
            publicId: "products/ring-3",
          },
        ],
        metal: "platinum",
        stone: "sapphire",
        weight: 4.8,
        sku: "RNG-003",
        stock: 3,
        featured: true,
        isActive: true,
        tags: ["luxury", "sapphire", "platinum"],
      },

      // Necklaces
      {
        name: "Celestial Gold Necklace",
        description:
          "An elegant 22K gold necklace featuring star and moon motifs. The delicate chain and celestial pendants create a dreamy, ethereal look. Perfect for both casual and formal wear.",
        shortDescription: "22K gold necklace with celestial motifs",
        price: 52999,
        salePrice: 47999,
        category: necklaces._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200",
            publicId: "products/necklace-1",
          },
        ],
        metal: "gold",
        stone: "none",
        weight: 12.5,
        sku: "NCK-001",
        stock: 4,
        featured: true,
        isActive: true,
        tags: ["celestial", "elegant", "gold"],
      },
      {
        name: "Diamond Pendant Necklace",
        description:
          "Sophisticated pendant featuring a cluster of diamonds in white gold. The modern design pairs well with any outfit, from business attire to evening wear.",
        shortDescription: "Diamond cluster pendant in white gold",
        price: 67999,
        category: necklaces._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1200",
            publicId: "products/necklace-2",
          },
        ],
        metal: "platinum",
        stone: "diamond",
        weight: 8.3,
        sku: "NCK-002",
        stock: 6,
        featured: false,
        isActive: true,
        tags: ["diamond", "modern", "pendant"],
      },
      {
        name: "Ruby Statement Necklace",
        description:
          "Bold statement necklace featuring oval-cut rubies and gold work. This traditional piece is perfect for weddings and festive occasions, showcasing rich heritage craftsmanship.",
        shortDescription: "Ruby and gold statement necklace",
        price: 125999,
        category: necklaces._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200",
            publicId: "products/necklace-3",
          },
        ],
        metal: "gold",
        stone: "ruby",
        weight: 35.6,
        sku: "NCK-003",
        stock: 2,
        featured: true,
        isActive: true,
        tags: ["ruby", "statement", "traditional", "bridal"],
      },

      // Earrings
      {
        name: "Diamond Stud Earrings",
        description:
          "Classic diamond studs set in platinum. Each earring features a perfectly cut diamond that captures and reflects light beautifully. An essential piece for every jewelry collection.",
        shortDescription: "Classic diamond studs in platinum",
        price: 38999,
        salePrice: 34999,
        category: earrings._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200",
            publicId: "products/earring-1",
          },
        ],
        metal: "platinum",
        stone: "diamond",
        weight: 2.4,
        sku: "EAR-001",
        stock: 10,
        featured: true,
        isActive: true,
        tags: ["diamond", "studs", "classic"],
      },
      {
        name: "Emerald Drop Earrings",
        description:
          "Elegant drop earrings featuring emerald stones in gold settings. The teardrop design adds sophistication and the green hue complements all skin tones.",
        shortDescription: "Emerald drop earrings in gold",
        price: 44999,
        category: earrings._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=1200",
            publicId: "products/earring-2",
          },
        ],
        metal: "gold",
        stone: "emerald",
        weight: 5.1,
        sku: "EAR-002",
        stock: 7,
        featured: false,
        isActive: true,
        tags: ["emerald", "drops", "elegant"],
      },
      {
        name: "Rose Gold Hoops",
        description:
          "Contemporary hoop earrings in rose gold with a polished finish. The medium size makes them versatile for both day and evening wear.",
        shortDescription: "Polished rose gold hoop earrings",
        price: 18999,
        category: earrings._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=1200",
            publicId: "products/earring-3",
          },
        ],
        metal: "rose-gold",
        stone: "none",
        weight: 3.8,
        sku: "EAR-003",
        stock: 12,
        featured: false,
        isActive: true,
        tags: ["hoops", "contemporary", "rose-gold"],
      },

      // Bracelets
      {
        name: "Diamond Tennis Bracelet",
        description:
          "Luxurious tennis bracelet featuring a continuous line of diamonds set in platinum. The secure clasp ensures comfort and safety. A timeless piece that adds sparkle to any wrist.",
        shortDescription: "Platinum diamond tennis bracelet",
        price: 145999,
        category: bracelets._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200",
            publicId: "products/bracelet-1",
          },
        ],
        metal: "platinum",
        stone: "diamond",
        weight: 15.2,
        sku: "BRC-001",
        stock: 3,
        featured: true,
        isActive: true,
        tags: ["diamond", "tennis", "luxury"],
      },
      {
        name: "Gold Chain Bracelet",
        description:
          "Delicate gold chain bracelet with adjustable length. The minimalist design makes it perfect for layering or wearing alone. Suitable for everyday elegance.",
        shortDescription: "Delicate adjustable gold chain",
        price: 22999,
        category: bracelets._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200",
            publicId: "products/bracelet-2",
          },
        ],
        metal: "gold",
        stone: "none",
        weight: 5.6,
        sku: "BRC-002",
        stock: 9,
        featured: false,
        isActive: true,
        tags: ["chain", "minimalist", "gold"],
      },

      // Sets
      {
        name: "Bridal Diamond Set",
        description:
          "Complete bridal set including necklace, earrings, and ring. Features diamonds and rubies set in gold. This luxurious set is perfect for weddings and special celebrations.",
        shortDescription: "Complete diamond & ruby bridal set",
        price: 299999,
        category: sets._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200",
            publicId: "products/set-1",
          },
        ],
        metal: "gold",
        stone: "diamond",
        weight: 65.4,
        sku: "SET-001",
        stock: 2,
        featured: true,
        isActive: true,
        tags: ["bridal", "diamond", "ruby", "complete-set"],
      },
      {
        name: "Everyday Elegance Set",
        description:
          "Matching necklace and earrings in rose gold with subtle diamond accents. Perfect for daily wear or office settings. Elegant yet understated.",
        shortDescription: "Rose gold necklace & earring set",
        price: 54999,
        category: sets._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200",
            publicId: "products/set-2",
          },
        ],
        metal: "rose-gold",
        stone: "diamond",
        weight: 12.8,
        sku: "SET-002",
        stock: 5,
        featured: false,
        isActive: true,
        tags: ["everyday", "rose-gold", "set"],
      },
      {
        name: "Traditional Temple Set",
        description:
          "Traditional temple jewellery set in gold with intricate deity motifs. Includes long necklace, earrings, and bangles. Perfect for cultural events and festivals.",
        shortDescription: "Traditional gold temple jewellery set",
        price: 189999,
        category: sets._id,
        images: [
          {
            url: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200",
            publicId: "products/set-3",
          },
        ],
        metal: "gold",
        stone: "ruby",
        weight: 85.3,
        sku: "SET-003",
        stock: 1,
        featured: false,
        isActive: true,
        tags: ["traditional", "temple", "cultural"],
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ ${createdProducts.length} products created`);

    console.log("🎫 Creating coupons...");
    const coupons = [
      {
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        minOrderValue: 10000,
        maxUses: 100,
        usedCount: 0,
        expiresAt: new Date("2025-12-31"),
        isActive: true,
      },
      {
        code: "FESTIVE2024",
        type: "flat",
        value: 5000,
        minOrderValue: 50000,
        maxUses: 50,
        usedCount: 0,
        expiresAt: new Date("2025-12-31"),
        isActive: true,
      },
    ];

    const createdCoupons = await Coupon.insertMany(coupons);
    console.log(`✅ ${createdCoupons.length} coupons created`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n👤 Admin Credentials:");
    console.log("   Email: admin@radheboutique.com");
    console.log("   Password: Admin@123");
    console.log("\n👤 Test User Credentials:");
    console.log("   Email: test@example.com");
    console.log("   Password: Test@123");
    console.log("\n🎫 Available Coupons:");
    console.log("   WELCOME10 - 10% off on orders above ₹10,000");
    console.log("   FESTIVE2024 - ₹5,000 off on orders above ₹50,000");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
