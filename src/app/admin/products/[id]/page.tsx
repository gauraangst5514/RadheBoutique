import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { EditProduct } from "./EditProduct";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;
  const [p] = await db.getProductsByIds([id]);
  if (!p) notFound();
  return <EditProduct product={p} />;
}
