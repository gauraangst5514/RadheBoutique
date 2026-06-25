import { z } from "zod";

// Auth Validations
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Address Validation
export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number. Must be 10 digits starting with 6-9"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
  isDefault: z.boolean().optional(),
});

// Product Validation
export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  slug: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().max(150, "Short description must be under 150 characters"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().positive().optional(),
  category: z.string().min(1, "Category is required"),
  metal: z.enum(["gold", "silver", "platinum", "rose-gold"]),
  stone: z.enum(["diamond", "ruby", "emerald", "sapphire", "none", "other"]),
  weight: z.number().positive("Weight must be positive"),
  sku: z.string().min(1, "SKU is required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// Category Validation
export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isActive: z.boolean().optional(),
});

// Review Validation
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  body: z.string().min(20, "Review must be at least 20 characters"),
});

// Coupon Validation
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .regex(/^[A-Z0-9]+$/, "Code must be uppercase letters and numbers only"),
  type: z.enum(["percentage", "flat"]),
  value: z.number().positive("Value must be positive"),
  minOrderValue: z.number().min(0, "Minimum order value cannot be negative"),
  maxUses: z.number().int().positive("Max uses must be positive"),
  expiresAt: z.date(),
  isActive: z.boolean().optional(),
});

// Order Validation (WhatsApp checkout flow — no payment gateway)
export const createOrderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().max(500, "Notes too long").optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().int().positive("Quantity must be positive"),
        metal: z.enum(["gold", "silver", "platinum", "rose-gold"]).optional(),
      })
    )
    .min(1, "Order must contain at least one item"),
  couponCode: z.string().optional(),
  shippingMethod: z.enum(["standard", "express"]).optional(),
});

export const updateOrderStatusSchema = z.object({
  orderStatus: z.enum([
    "pending_payment",
    "paid",
    "packed",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).optional(),
  trackingNumber: z.string().optional(),
});

// Checkout Validation
export const checkoutSchema = z.object({
  shippingAddress: addressSchema.omit({ label: true }),
  shippingMethod: z.enum(["standard", "express"]),
  couponCode: z.string().optional(),
});

// Contact Form Validation
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

// Newsletter Validation
export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// User Profile Update Validation
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number").optional(),
});

// Change Password Validation
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusFormData = z.infer<typeof updateOrderStatusSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
