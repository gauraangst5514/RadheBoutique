import mongoose, { Schema } from "mongoose";
import { IOrder } from "@/types";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    metal: {
      type: String,
      enum: ["gold", "silver", "platinum", "rose-gold"],
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Customer details
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },

    // Shipping address
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    notes: { type: String },

    items: { type: [orderItemSchema], required: true },

    // Pricing
    subtotal: { type: Number, required: true, min: 0 },
    shipping: { type: Number, required: true, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    couponCode: { type: String },

    // Status
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending_payment", "paid", "packed", "shipped", "delivered", "cancelled"],
      default: "pending_payment",
    },

    trackingNumber: { type: String },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ phone: 1 });

const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
