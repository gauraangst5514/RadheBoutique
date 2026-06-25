import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductsManager from "@/components/admin/ProductsManager";

void Category;

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session || !session.user || (session.user as any).role !== "admin") redirect("/");

  await connectDB();
  const products = await Product.find().populate("category", "name").sort("-createdAt").lean();
  const plainProducts = JSON.parse(JSON.stringify(products));

  return <ProductsManager initialProducts={plainProducts} />;
}
