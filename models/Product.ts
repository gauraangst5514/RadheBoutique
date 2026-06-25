import mongoose, { Schema } from "mongoose";
import { IProduct } from "@/types";

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: 150,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    metal: {
      type: String,
      enum: ["gold", "silver", "platinum", "rose-gold"],
      required: [true, "Metal type is required"],
    },
    stone: {
      type: String,
      enum: ["diamond", "ruby", "emerald", "sapphire", "none", "other"],
      default: "none",
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: 0,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: 0,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  }
  next();
});

// Indexes for better query performance
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ metal: 1 });
productSchema.index({ stone: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
