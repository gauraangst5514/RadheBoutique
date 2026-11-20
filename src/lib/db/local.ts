import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { seedProducts } from "@/data/seed";
import type { Order, Product, RestockRequest } from "@/lib/types";
import { orderNumber, type NewProductInput, type ProductPatch, type Repo, type StockLine } from "./repo";

/**
 * File-backed store for local development and demos (no Supabase keys).
 * Data lives in .data/db.json; uploads go to public/uploads.
 * Not for production: serverless hosts have read-only, non-shared disks.
 */
interface Db {
  products: Product[];
  orders: Order[];
  restock: RestockRequest[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8")) as Db;
  } catch {
    const fresh: Db = { products: structuredClone(seedProducts), orders: [], restock: [] };
    await save(fresh);
    return fresh;
  }
}

async function save(db: Db) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

/** Serialise read-modify-write so concurrent requests don't clobber each other. */
function tx<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const out = await fn(db);
    await save(db);
    return out;
  });
  queue = run.catch(() => undefined);
  return run;
}

export const localRepo: Repo = {
  kind: "local",

  async listProducts(opts = {}) {
    const db = await load();
    return db.products
      .filter((p) => (opts.includeInactive ? true : p.active))
      .filter((p) => (opts.category ? p.category === opts.category : true))
      .filter((p) => (opts.featured ? p.featured : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getProductBySlug(slug) {
    const db = await load();
    return db.products.find((p) => p.slug === slug) ?? null;
  },

  async getProductsByIds(ids) {
    const db = await load();
    return db.products.filter((p) => ids.includes(p.id));
  },

  createProduct(input: NewProductInput) {
    return tx((db) => {
      let slug = input.slug;
      while (db.products.some((p) => p.slug === slug)) slug = `${input.slug}-${Math.random().toString(36).slice(2, 5)}`;
      const product: Product = {
        id: randomUUID(),
        slug,
        name: input.name,
        category: input.category,
        price: input.price,
        mrp: input.mrp ?? null,
        description: input.description,
        tags: input.tags,
        images: input.images,
        variants: input.variants.map((v) => ({ ...v, id: randomUUID() })),
        tryOn: input.tryOn,
        tryOnImage: input.tryOnImage ?? null,
        active: true,
        featured: input.featured,
        createdAt: new Date().toISOString(),
      };
      db.products.push(product);
      return product;
    });
  },

  updateProduct(id, patch: ProductPatch) {
    return tx((db) => {
      const p = db.products.find((x) => x.id === id);
      if (!p) return null;
      const { variants, ...rest } = patch;
      Object.assign(p, Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined)));
      for (const v of variants ?? []) {
        const target = p.variants.find((x) => x.id === v.id);
        if (target) target.stock = Math.max(0, Math.floor(v.stock));
      }
      return p;
    });
  },

  createOrder(order) {
    return tx((db) => {
      const full: Order = { ...order, id: randomUUID(), number: orderNumber(), createdAt: new Date().toISOString() };
      db.orders.unshift(full);
      return full;
    });
  },

  async getOrder(id) {
    const db = await load();
    return db.orders.find((o) => o.id === id) ?? null;
  },

  async getOrderByRazorpayId(rzp) {
    const db = await load();
    return db.orders.find((o) => o.razorpayOrderId === rzp) ?? null;
  },

  async listOrders(limit = 100) {
    const db = await load();
    return db.orders.slice(0, limit);
  },

  updateOrder(id, patch) {
    return tx((db) => {
      const o = db.orders.find((x) => x.id === id);
      if (!o) return null;
      Object.assign(o, patch);
      return o;
    });
  },

  takeStock(lines: StockLine[]) {
    return tx((db) => {
      const all = db.products.flatMap((p) => p.variants);
      for (const l of lines) {
        const v = all.find((x) => x.id === l.variantId);
        if (!v || v.stock < l.qty) return { ok: false as const, variantId: l.variantId };
      }
      for (const l of lines) all.find((x) => x.id === l.variantId)!.stock -= l.qty;
      return { ok: true as const };
    });
  },

  async returnStock(lines) {
    await tx((db) => {
      const all = db.products.flatMap((p) => p.variants);
      for (const l of lines) {
        const v = all.find((x) => x.id === l.variantId);
        if (v) v.stock += l.qty;
      }
    });
  },

  async addRestockRequest(req) {
    await tx((db) => {
      db.restock.unshift({ ...req, id: randomUUID(), createdAt: new Date().toISOString() });
    });
  },

  async listRestockRequests() {
    const db = await load();
    return db.restock;
  },

  async saveImage(file) {
    const dir = path.join(DATA_DIR, "uploads");
    await fs.mkdir(dir, { recursive: true });
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const name = `${randomUUID()}.${ext}`;
    await fs.writeFile(path.join(dir, name), file.bytes);
    return `/api/uploads/${name}`;
  },
};
