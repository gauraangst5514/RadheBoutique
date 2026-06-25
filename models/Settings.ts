import mongoose, { Schema } from "mongoose";

export interface ISiteSettings {
  _id: string;
  // Announcement bar
  announcementEnabled: boolean;
  announcementText: string;
  announcementLink?: string;

  // Hero section
  heroHeadline: string;
  heroSubheadline: string;
  heroDescription: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;

  // Featured card
  featuredTitle: string;
  featuredSubtitle: string;
  featuredDescription: string;
  featuredLink: string;
  featuredImage: string;

  // Payment details (sent to customers on WhatsApp)
  upiId: string;
  paymentQrImage: string;
  paymentNote: string;

  updatedAt: Date;
}

const settingsSchema = new Schema<ISiteSettings>(
  {
    announcementEnabled: { type: Boolean, default: true },
    announcementText: { type: String, default: "✨ Free shipping on orders above ₹5,000 — Shop Now!" },
    announcementLink: { type: String, default: "/shop" },

    heroHeadline: { type: String, default: "Jewellery That" },
    heroSubheadline: { type: String, default: "Tells a Story" },
    heroDescription: { type: String, default: "Handcrafted heirlooms rooted in tradition. Each piece is a quiet celebration of art, love, and timeless elegance." },
    heroCta1Text: { type: String, default: "Shop Collection" },
    heroCta1Link: { type: String, default: "/shop" },
    heroCta2Text: { type: String, default: "Our Story" },
    heroCta2Link: { type: String, default: "/about" },

    featuredTitle: { type: String, default: "Bridal Collection" },
    featuredSubtitle: { type: String, default: "Featured" },
    featuredDescription: { type: String, default: "Timeless pieces for your most cherished moments. Handcrafted with certified diamonds and 22K hallmarked gold." },
    featuredLink: { type: String, default: "/shop" },
    featuredImage: { type: String, default: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&h=700&fit=crop" },

    upiId: { type: String, default: "" },
    paymentQrImage: { type: String, default: "" },
    paymentNote: { type: String, default: "Please complete payment and reply with the screenshot to confirm your order." },
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model<ISiteSettings>("Settings", settingsSchema);

export default Settings;
