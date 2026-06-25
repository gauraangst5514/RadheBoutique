import mongoose, { Schema } from "mongoose";
import { IReview } from "@/types";

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Review body is required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;
