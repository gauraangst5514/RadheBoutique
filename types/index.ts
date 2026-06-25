
// User Types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  avatar?: string;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword?: (password: string) => Promise<boolean>;
}

export interface IAddress {
  _id?: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// Product Types
export type MetalType = "gold" | "silver" | "platinum" | "rose-gold";
export type StoneType = "diamond" | "ruby" | "emerald" | "sapphire" | "none" | "other";

export interface IProductImage {
  url: string;
  publicId: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  category: ICategory | string;
  images: IProductImage[];
  metal: MetalType;
  stone: StoneType;
  weight: number;
  sku: string;
  stock: number;
  featured: boolean;
  isActive: boolean;
  tags: string[];
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: IProductImage;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
// Unified order workflow status (drives admin dashboard + WhatsApp flow)
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "refunded";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending_payment",
  "paid",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending",
  paid: "Paid",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export interface IOrderItem {
  product?: IProduct | string;
  productId?: string;
  name: string;
  productName?: string;
  image?: string;
  price: number;
  quantity: number;
  subtotal?: number;
  metal?: MetalType;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  user?: IUser | string | null;

  // Customer details
  customerName: string;
  phone: string;
  email?: string;

  // Shipping
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;

  items: IOrderItem[];

  // Pricing
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;

  // Status
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;

  trackingNumber?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Payload for creating an order (no payment gateway)
export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    metal?: MetalType;
  }[];
  couponCode?: string;
  shippingMethod?: "standard" | "express";
}

// Review Types
export interface IReview {
  _id: string;
  product: IProduct | string;
  user: IUser | string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Coupon Types
export type CouponType = "percentage" | "flat";

export interface ICoupon {
  _id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderValue: number;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Types
export interface ICartItem {
  product: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  metal: MetalType;
  stock: number;
}

export interface ICart {
  items: ICartItem[];
  subtotal: number;
  total: number;
}

// Wishlist Types
export interface IWishlistItem {
  product: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  inStock: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Filter Types
export interface ProductFilters {
  category?: string;
  metal?: MetalType | MetalType[];
  stone?: StoneType | StoneType[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  sort?: string;
}

// Admin Stats Types
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CheckoutFormData {
  address: IShippingAddress;
  shippingMethod: "standard" | "express";
  couponCode?: string;
}

// Session Types
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}
