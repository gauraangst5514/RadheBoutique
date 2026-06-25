import mongoose, { Schema } from "mongoose";
import { ICoupon } from "@/types";

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "flat"],
      required: [true, "Coupon type is required"],
    },
    value: {
      type: Number,
      required: [true, "Coupon value is required"],
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxUses: {
      type: Number,
      required: [true, "Max uses is required"],
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for code lookups
couponSchema.index({ code: 1 });

const Coupon = mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", couponSchema);

export default Coupon;
