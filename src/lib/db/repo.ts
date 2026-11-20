import type { Order, Product, RestockRequest, Variant } from "@/lib/types";
import type { CategorySlug } from "@/config/store";

export interface StockLine {
  variantId: string;
  qty: number;
}

export interface NewProductInput {
  name: string;
  slug: string;
  category: CategorySlug;
  price: number;
  mrp?: number | null;
  description: string;
  tags: string[];
  images: Product["images"];
  variants: Omit<Variant, "id">[];
  tryOn: Product["tryOn"];
  tryOnImage?: string | null;
  featured: boolean;
}

export interface ProductPatch {
  name?: string;
  price?: number;
  mrp?: number | null;
  description?: string;
  active?: boolean;
  featured?: boolean;
  tags?: string[];
  variants?: { id: string; stock: number }[];
}

export interface Repo {
  readonly kind: "supabase" | "local";
  listProducts(opts?: { category?: CategorySlug; includeInactive?: boolean; featured?: boolean }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  createProduct(input: NewProductInput): Promise<Product>;
  updateProduct(id: string, patch: ProductPatch): Promise<Product | null>;

  createOrder(order: Omit<Order, "id" | "number" | "createdAt">): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  getOrderByRazorpayId(rzpOrderId: string): Promise<Order | null>;
  listOrders(limit?: number): Promise<Order[]>;
  updateOrder(id: string, patch: Partial<Pick<Order, "status" | "razorpayPaymentId" | "stockApplied" | "note">>): Promise<Order | null>;

  /** Atomically take stock for every line, or nothing at all. */
  takeStock(lines: StockLine[]): Promise<{ ok: true } | { ok: false; variantId: string }>;
  /** Put stock back (cancelled orders). */
  returnStock(lines: StockLine[]): Promise<void>;

  addRestockRequest(req: Omit<RestockRequest, "id" | "createdAt">): Promise<void>;
  listRestockRequests(): Promise<RestockRequest[]>;

  /** Store an uploaded image and return its public URL. */
  saveImage(file: { name: string; type: string; bytes: Uint8Array }): Promise<string>;
}

export function orderNumber() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RB-${ymd}-${rand}`;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
