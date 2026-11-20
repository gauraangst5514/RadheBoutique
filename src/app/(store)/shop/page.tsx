import { db } from "@/lib/db";
import { ShopGrid } from "./ShopGrid";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Shop all jewellery",
  description: "All of Radhe Boutique's jewellery in one place: Korean earrings from ₹29 and more. Order on WhatsApp, free shipping on ₹299+.",
  alternates: { canonical: "/shop" },
};

export default async function ShopAll() {
  const products = await db.listProducts();
  return <ShopGrid title="Everything" products={products} />;
}
