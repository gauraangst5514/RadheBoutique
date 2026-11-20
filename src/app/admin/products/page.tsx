import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductsManager } from "./ProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requireAdminPage();
  const { filter } = await searchParams;
  const products = await db.listProducts({ includeInactive: true });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-display m-0 text-[40px] leading-none">PRODUCTS</h1>
        <Link href="/admin/products/new" className="flex min-h-12 items-center rounded-full bg-pink px-5 font-bold text-white no-underline">
          + Add product
        </Link>
      </div>
      <ProductsManager products={products} initialFilter={filter === "attention" ? "attention" : "all"} />
    </div>
  );
}
