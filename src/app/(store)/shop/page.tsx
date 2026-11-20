import { db } from "@/lib/db";
import { ShopGrid } from "./ShopGrid";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop everything" };

export default async function ShopAll() {
  const products = await db.listProducts();
  return <ShopGrid title="Everything" products={products} />;
}
