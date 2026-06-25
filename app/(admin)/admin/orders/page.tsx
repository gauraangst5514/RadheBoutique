import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/lib/services/orderService";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  const orders = await getOrders();

  return (
    <div className="min-h-screen bg-bg text-ivory py-12 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-gold">Orders</h1>
          <Link href="/admin" className="text-gold hover:underline text-sm">
            ← Back to Dashboard
          </Link>
        </div>

        <OrdersTable initialOrders={orders} />
      </div>
    </div>
  );
}
