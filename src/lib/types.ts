import type { CategorySlug } from "@/config/store";

export type ImageKind = "photo" | "cutout" | "lifestyle";

export interface ProductImage {
  url: string;
  kind: ImageKind;
  alt?: string;
}

export interface Variant {
  id: string;
  name: string;
  swatch?: string | null;
  sku: string;
  stock: number;
  /** Transparent PNG used by live try-on for this colour (falls back to the product's). */
  tryOnImage?: string | null;
}

export type TryOnKind = "earrings" | "necklace" | null;

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number; // rupees
  mrp?: number | null;
  description: string;
  tags: string[];
  images: ProductImage[];
  variants: Variant[];
  tryOn: TryOnKind;
  /** Transparent PNG used by live try-on: one earring, or the whole necklace, facing the camera. */
  tryOnImage?: string | null;
  active: boolean;
  featured: boolean;
  reelUrl?: string | null;
  createdAt: string;
}

export type PaymentMethod = "razorpay" | "cod" | "whatsapp";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "cod_confirmed"
  | "whatsapp_pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "needs_attention";

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  category: CategorySlug;
  unitPrice: number;
  qty: number;
  image?: string | null;
}

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  number: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  stockApplied: boolean;
  customer: Customer;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface CartLine {
  productId: string;
  variantId: string;
  qty: number;
}

export interface RestockRequest {
  id: string;
  productId: string;
  variantId: string;
  phone: string;
  createdAt: string;
}
