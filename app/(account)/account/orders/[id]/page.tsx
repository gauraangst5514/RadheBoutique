import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { formatPrice, formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  await connectDB();

  const order = await Order.findOne({
    _id: params.id,
    user: (session.user as any).id,
  }).lean();

  if (!order) notFound();

  const o = JSON.parse(JSON.stringify(order));

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

  const steps = ["pending_payment", "paid", "packed", "shipped", "delivered"];
  const currentStep = steps.indexOf(o.orderStatus);

  return (
    <div className="min-h-screen bg-bg text-ivory py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/account/orders" className="text-gold hover:underline text-sm mb-6 inline-block">
          ← Back to Orders
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl text-gold">
              Order #{o._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-ivory/60 text-sm mt-1">Placed on {formatDate(o.createdAt)}</p>
          </div>
          <Badge variant={getStatusVariant(o.orderStatus) as any}>
            {statusLabel(o.orderStatus)}
          </Badge>
        </div>

        {/* Progress Tracker */}
        {o.orderStatus !== "cancelled" && (
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        i <= currentStep ? "bg-gold text-bg" : "bg-border text-ivory/40"
                      }`}
                    >
                      {i <= currentStep ? "✓" : i + 1}
                    </div>
                    <span className="text-xs mt-1 text-ivory/60 capitalize">
                      {statusLabel(step)}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 md:w-16 h-0.5 mx-1 ${i < currentStep ? "bg-gold" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Items */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-6">
          <h2 className="font-display text-xl text-gold mb-4">Items</h2>
          <div className="space-y-4">
            {o.items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="relative w-16 h-16 bg-bg rounded overflow-hidden flex-shrink-0">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-ivory/60">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="font-display text-xl text-gold mb-4">Shipping Address</h2>
            <div className="text-ivory/80 text-sm space-y-1">
              <p className="font-medium text-ivory">{o.customerName}</p>
              <p>{o.phone}</p>
              <p>{o.address}</p>
              <p>{o.city}, {o.state} - {o.pincode}</p>
            </div>
            {o.trackingNumber && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-ivory/60">Tracking Number</p>
                <p className="text-gold font-mono">{o.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <h2 className="font-display text-xl text-gold mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ivory/60">Subtotal</span>
                <span>{formatPrice(o.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/60">Shipping</span>
                <span>{o.shipping === 0 ? "FREE" : formatPrice(o.shipping)}</span>
              </div>
              {o.discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount {o.couponCode && `(${o.couponCode})`}</span>
                  <span>-{formatPrice(o.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                <span>Total</span>
                <span className="text-gold">{formatPrice(o.total)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-ivory/60">Payment Status</span>
                <Badge variant={o.paymentStatus === "paid" ? "success" : "warning"}>
                  {o.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
