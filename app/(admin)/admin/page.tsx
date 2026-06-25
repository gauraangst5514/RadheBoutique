import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrderStats, getOrders } from "@/lib/services/orderService";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/types";
import StatsCard from "@/components/admin/StatsCard";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || (session.user as any).role !== "admin") redirect("/");

  const [stats, recentOrders] = await Promise.all([
    getOrderStats(),
    getOrders().then((orders) => orders.slice(0, 8)),
  ]);

  const conversionRate = stats.total > 0
    ? Math.round(((stats.paid + stats.packed + stats.shipped + stats.delivered) / stats.total) * 100)
    : 0;

  const avgOrderValue = stats.total > 0 && stats.revenue > 0
    ? Math.round(stats.revenue / (stats.paid + stats.packed + stats.shipped + stats.delivered || 1))
    : 0;

  return (
    <div className="min-h-screen bg-bg text-ivory py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl text-ivory mb-1">Dashboard</h1>
            <p className="text-ivory/50 text-sm">Welcome back, {session.user?.name || "Admin"}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/orders" className="bg-gold text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
              Manage Orders
            </Link>
            <Link href="/admin/settings" className="border border-border text-ivory hover:border-gold hover:text-gold px-5 py-2.5 rounded-full font-semibold text-sm transition-all">
              Store Settings
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Revenue" value={formatPrice(stats.revenue)} accent="gold" icon="💰" />
          <StatsCard label="Total Orders" value={stats.total} accent="gold" icon="📦" />
          <StatsCard label="Conversion Rate" value={`${conversionRate}%`} accent="green" icon="📈" />
          <StatsCard label="Avg. Order Value" value={formatPrice(avgOrderValue)} accent="blue" icon="💎" />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          <MiniStat label="Pending" value={stats.pending_payment} color="text-yellow-600" />
          <MiniStat label="Paid" value={stats.paid} color="text-blue-600" />
          <MiniStat label="Packed" value={stats.packed} color="text-purple-600" />
          <MiniStat label="Shipped" value={stats.shipped} color="text-cyan-600" />
          <MiniStat label="Delivered" value={stats.delivered} color="text-green-600" />
          <MiniStat label="Cancelled" value={stats.cancelled} color="text-red-600" />
        </div>

        {/* Two-column: Recent Orders + Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg">Recent Orders</h2>
              <Link href="/admin/orders" className="text-gold text-sm font-semibold hover:underline">
                View All →
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.length === 0 ? (
                <p className="p-6 text-ivory/50 text-center text-sm">No orders yet</p>
              ) : (
                recentOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between px-6 py-3.5 hover:bg-sand/20 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gold">{order.orderNumber}</span>
                        <StatusBadge status={order.orderStatus} />
                      </div>
                      <p className="text-xs text-ivory/50 mt-0.5 truncate">
                        {order.customerName} • {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold ml-4">{formatPrice(order.total)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="font-display text-lg mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <QuickLink href="/admin/orders" label="Orders" desc="Manage all orders" icon="📋" />
                <QuickLink href="/admin/products" label="Products" desc="Manage inventory" icon="💍" />
                <QuickLink href="/admin/settings" label="Settings" desc="Edit storefront" icon="⚙️" />
                <QuickLink href="/" label="View Store" desc="See live storefront" icon="🌐" />
              </div>
            </div>

            {/* Alerts */}
            {stats.pending_payment > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ Pending Payments</p>
                <p className="text-xs text-yellow-700">
                  {stats.pending_payment} order{stats.pending_payment > 1 ? "s" : ""} awaiting payment confirmation.
                </p>
                <Link href="/admin/orders" className="text-xs text-yellow-800 font-semibold hover:underline mt-2 inline-block">
                  Review now →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white border border-border rounded-xl p-3 text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-ivory/50 mt-0.5">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    pending_payment: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    packed: "bg-purple-100 text-purple-800",
    shipped: "bg-cyan-100 text-cyan-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colorMap[status] || "bg-gray-100 text-gray-700"}`}>
      {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status}
    </span>
  );
}

function QuickLink({ href, label, desc, icon }: { href: string; label: string; desc: string; icon: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-sand/30 transition-colors group">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-sm font-semibold group-hover:text-gold transition-colors">{label}</p>
        <p className="text-xs text-ivory/50">{desc}</p>
      </div>
    </Link>
  );
}
