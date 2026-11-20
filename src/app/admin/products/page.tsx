import Link from "next/link";
import { requireAdminPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { categoryName } from "@/config/store";
import { rupees } from "@/lib/pricing";
import { totalStock } from "@/lib/stock";
import { ProductImg } from "@/components/ProductImg";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  await requireAdminPage();
  const products = await db.listProducts({ includeInactive: true });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-display m-0 text-[40px] leading-none">PRODUCTS</h1>
        <Link href="/admin/products/new" className="flex min-h-12 items-center rounded-full bg-pink px-5 font-bold text-white no-underline">
          + Add product
        </Link>
      </div>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {products.map((p) => {
          const stock = totalStock(p);
          return (
            <li key={p.id}>
              <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-2.5 no-underline">
                <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-[#F3E7DF]">
                  <ProductImg p={p} className="size-full object-cover" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-bold">{p.name}</span>
                  <span className="text-sm text-muted">
                    {categoryName(p.category)} · {rupees(p.price)} {!p.active && "· Hidden"}
                  </span>
                </span>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${stock === 0 ? "bg-[#FBE4E7] text-bad" : stock <= 3 ? "bg-[#FDEBD9] text-[#7A3A06]" : "bg-[#E4F2EB] text-ok"}`}>
                  {stock === 0 ? "Sold out" : `${stock} online`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
