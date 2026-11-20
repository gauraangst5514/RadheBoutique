import "server-only";
import { randomUUID } from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Order, Product, RestockRequest, Variant } from "@/lib/types";
import { orderNumber, type Repo } from "./repo";
import { supabaseKey, supabaseUrl } from "./env";

/**
 * Supabase-backed store. Uses the service-role key, so it must only run on the server.
 * Schema: supabase/schema.sql
 */
let client: SupabaseClient | null = null;
function sb() {
  if (!client) {
    client = createClient(supabaseUrl()!, supabaseKey()!, {
      auth: { persistSession: false },
    });
  }
  return client;
}

const BUCKET = process.env.SUPABASE_BUCKET || "products";

/* eslint-disable @typescript-eslint/no-explicit-any */
function toVariant(r: any): Variant {
  return { id: r.id, name: r.name, swatch: r.swatch, sku: r.sku, stock: r.stock, tryOnImage: r.try_on_image ?? null };
}
function toProduct(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category,
    price: Number(r.price),
    mrp: r.mrp == null ? null : Number(r.mrp),
    description: r.description ?? "",
    tags: r.tags ?? [],
    images: r.images ?? [],
    variants: ((r.variants ?? []) as any[]).sort((a, b) => a.position - b.position).map(toVariant),
    tryOn: r.try_on,
    tryOnImage: r.try_on_image ?? null,
    active: r.active,
    featured: r.featured,
    reelUrl: r.reel_url,
    createdAt: r.created_at,
  };
}
function toOrder(r: any): Order {
  return {
    id: r.id,
    number: r.number,
    items: r.items,
    subtotal: Number(r.subtotal),
    discount: Number(r.discount),
    shipping: Number(r.shipping),
    codFee: Number(r.cod_fee),
    total: Number(r.total),
    paymentMethod: r.payment_method,
    status: r.status,
    stockApplied: r.stock_applied,
    customer: r.customer,
    razorpayOrderId: r.razorpay_order_id,
    razorpayPaymentId: r.razorpay_payment_id,
    note: r.note,
    createdAt: r.created_at,
  };
}
function check<T>(res: { data: T; error: any }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

const PRODUCT_SELECT = "*, variants(*)";

export const supabaseRepo: Repo = {
  kind: "supabase",

  async listProducts(opts = {}) {
    let q = sb().from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });
    if (!opts.includeInactive) q = q.eq("active", true);
    if (opts.category) q = q.eq("category", opts.category);
    if (opts.featured) q = q.eq("featured", true);
    return (check(await q) as any[]).map(toProduct);
  },

  async getProductBySlug(slug) {
    const r = check(await sb().from("products").select(PRODUCT_SELECT).eq("slug", slug).maybeSingle());
    return r ? toProduct(r) : null;
  },

  async getProductsByIds(ids) {
    if (!ids.length) return [];
    return (check(await sb().from("products").select(PRODUCT_SELECT).in("id", ids)) as any[]).map(toProduct);
  },

  async createProduct(input) {
    let slug = input.slug;
    const existing = check(await sb().from("products").select("id").eq("slug", slug).maybeSingle());
    if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`;
    const row = check(
      await sb()
        .from("products")
        .insert({
          slug,
          name: input.name,
          category: input.category,
          price: input.price,
          mrp: input.mrp ?? null,
          description: input.description,
          tags: input.tags,
          images: input.images,
          try_on: input.tryOn,
          try_on_image: input.tryOnImage ?? null,
          featured: input.featured,
        })
        .select("id")
        .single(),
    ) as any;
    if (input.variants.length) {
      check(
        await sb()
          .from("variants")
          .insert(input.variants.map((v, i) => ({ product_id: row.id, name: v.name, swatch: v.swatch ?? null, sku: v.sku, stock: v.stock, position: i, try_on_image: v.tryOnImage ?? null }))),
      );
    }
    const full = check(await sb().from("products").select(PRODUCT_SELECT).eq("id", row.id).single());
    return toProduct(full);
  },

  async updateProduct(id, patch) {
    const { variants, mrp, ...rest } = patch;
    const fields: Record<string, unknown> = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined));
    if (mrp !== undefined) fields.mrp = mrp;
    if (Object.keys(fields).length) check(await sb().from("products").update(fields).eq("id", id));
    for (const v of variants ?? []) {
      check(await sb().from("variants").update({ stock: Math.max(0, Math.floor(v.stock)) }).eq("id", v.id).eq("product_id", id));
    }
    const full = check(await sb().from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle());
    return full ? toProduct(full) : null;
  },

  async createOrder(o) {
    const row = check(
      await sb()
        .from("orders")
        .insert({
          number: orderNumber(),
          items: o.items,
          subtotal: o.subtotal,
          discount: o.discount,
          shipping: o.shipping,
          cod_fee: o.codFee,
          total: o.total,
          payment_method: o.paymentMethod,
          status: o.status,
          stock_applied: o.stockApplied,
          customer: o.customer,
          razorpay_order_id: o.razorpayOrderId ?? null,
          note: o.note ?? null,
        })
        .select("*")
        .single(),
    );
    return toOrder(row);
  },

  async getOrder(id) {
    const r = check(await sb().from("orders").select("*").eq("id", id).maybeSingle());
    return r ? toOrder(r) : null;
  },

  async getOrderByRazorpayId(rzp) {
    const r = check(await sb().from("orders").select("*").eq("razorpay_order_id", rzp).maybeSingle());
    return r ? toOrder(r) : null;
  },

  async listOrders(limit = 100) {
    return (check(await sb().from("orders").select("*").order("created_at", { ascending: false }).limit(limit)) as any[]).map(toOrder);
  },

  async updateOrder(id, patch) {
    const fields: Record<string, unknown> = {};
    if (patch.status !== undefined) fields.status = patch.status;
    if (patch.razorpayPaymentId !== undefined) fields.razorpay_payment_id = patch.razorpayPaymentId;
    if (patch.stockApplied !== undefined) fields.stock_applied = patch.stockApplied;
    if (patch.note !== undefined) fields.note = patch.note;
    const r = check(await sb().from("orders").update(fields).eq("id", id).select("*").maybeSingle());
    return r ? toOrder(r) : null;
  },

  async takeStock(lines) {
    const { data, error } = await sb().rpc("take_stock", { p_lines: lines.map((l) => ({ variant_id: l.variantId, qty: l.qty })) });
    if (error) throw new Error(error.message);
    // RPC returns null on success, or the variant id that was short.
    return data ? { ok: false, variantId: data as string } : { ok: true };
  },

  async returnStock(lines) {
    const { error } = await sb().rpc("return_stock", { p_lines: lines.map((l) => ({ variant_id: l.variantId, qty: l.qty })) });
    if (error) throw new Error(error.message);
  },

  async addRestockRequest(req) {
    check(await sb().from("restock_requests").insert({ product_id: req.productId, variant_id: req.variantId, phone: req.phone }));
  },

  async listRestockRequests() {
    const rows = check(await sb().from("restock_requests").select("*").order("created_at", { ascending: false }).limit(200)) as any[];
    return rows.map((r): RestockRequest => ({ id: r.id, productId: r.product_id, variantId: r.variant_id, phone: r.phone, createdAt: r.created_at }));
  },

  async saveImage(file) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const key = `${new Date().toISOString().slice(0, 7)}/${randomUUID()}.${ext}`;
    const { error } = await sb().storage.from(BUCKET).upload(key, file.bytes, { contentType: file.type, upsert: false });
    if (error) throw new Error(error.message);
    return sb().storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
  },
};
