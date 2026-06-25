import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  await connectDB();

  const orders = await Order.find({ user: (session.user as any).id })
    .sort("-createdAt")
    .lean();

  const plainOrders = JSON.parse(JSON.stringify(orders));

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered": return "success";
      case "shipped": return "info";
      case "packed": return "info";
      case "paid": return "info";
      case "cancelled": return "danger";
      default: return "warning";
    }
  };

  const statusLabel = (s: string) =>
    s.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="min-h-screen bg-bg text-ivory py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-gold">My Orders</h1>
          <Link href="/account" className="text-gold hover:underline text-sm">
            ← Back to Account
          </Link>
        </div>

        {plainOrders.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg p-12 text-center">
            <p className="text-ivory/60 mb-6">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/shop"
              className="bg-gold text-bg px-6 py-3 rounded-sm font-semibold hover:bg-gold/90 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {plainOrders.map((order: any) => (
              <div
                key={order._id}
                className="bg-surface border border-border rounded-lg p-6 hover:border-gold/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-ivory/60 mb-1">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-ivory/60">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant={getStatusVariant(order.orderStatus) as any}>
                      {statusLabel(order.orderStatus)}
                    </Badge>
                    <span className="text-gold font-semibold text-lg">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item: any, idx: number) => (
                      <span key={idx} className="text-sm text-ivory/70 bg-bg px-3 py-1 rounded">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-ivory/40">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} •
                    Payment: {order.paymentStatus}
                  </span>
                  <Link
                    href={`/account/orders/${order._id}`}
                    className="text-gold text-sm hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
