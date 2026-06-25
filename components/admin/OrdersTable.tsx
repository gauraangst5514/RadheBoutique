"use client";

import { useState, useEffect } from "react";
import { IOrder, OrderStatus, ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/types";
import { formatPrice, formatDate, formatDateTime, getOrderStatusColor, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import toast from "react-hot-toast";
import {
  Eye,
  Pencil,
  FileText,
  Copy,
  MessageCircle,
  Trash2,
} from "lucide-react";

interface OrdersTableProps {
  initialOrders: IOrder[];
}

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Radhe Boutique";

interface PaymentSettings {
  upiId?: string;
  paymentQrImage?: string;
  paymentNote?: string;
}

export default function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<IOrder[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<IOrder | null>(null);
  const [editingStatus, setEditingStatus] = useState<IOrder | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("pending_payment");
  const [tracking, setTracking] = useState("");
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState<PaymentSettings>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setPayment({
            upiId: d.data.upiId,
            paymentQrImage: d.data.paymentQrImage,
            paymentNote: d.data.paymentNote,
          });
        }
      })
      .catch(() => {});
  }, []);

  const filtered = orders.filter((o) => {
    const matchesStatus = filter === "all" || o.orderStatus === filter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q);
    return matchesStatus && matchesSearch;
  });

  /** Bill + payment message sent FROM store TO customer. */
  const buildCustomerMessage = (order: IOrder): string => {
    const items = order.items.map((i) => `- ${i.productName || i.name} x ${i.quantity}`).join("\n");
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const invoiceLink = `${origin}/api/invoice/${order.orderNumber}`;

    const lines = [
      `Hello ${order.customerName},`, "",
      `Thank you for shopping with ${BRAND}!`, "",
      `Your order ${order.orderNumber} has been received. 🧾`, "",
      "Order Summary:", items, "",
      `Invoice Amount: ${formatPrice(order.total)}`,
      `View / download your bill: ${invoiceLink}`, "",
      "── Payment Details ──",
    ];

    if (payment.upiId) lines.push(`UPI: ${payment.upiId}`);
    if (payment.paymentQrImage) lines.push(`Scan QR to pay: ${payment.paymentQrImage}`);
    if (!payment.upiId && !payment.paymentQrImage) {
      lines.push("Our team will share payment details shortly.");
    }

    lines.push("", payment.paymentNote || "Please reply with the payment screenshot to confirm. We'll dispatch once confirmed.", "", `Thank you! 💛 ${BRAND}`);
    return lines.join("\n");
  };

  const normalizePhone = (phone: string) => {
    const d = phone.replace(/\D/g, "");
    return d.length === 10 ? `91${d}` : d;
  };

  const handleCopyMessage = async (order: IOrder) => {
    try {
      await navigator.clipboard.writeText(buildCustomerMessage(order));
      toast.success("WhatsApp message copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleOpenWhatsApp = (order: IOrder) => {
    window.open(
      `https://wa.me/${normalizePhone(order.phone)}?text=${encodeURIComponent(buildCustomerMessage(order))}`,
      "_blank"
    );
  };

  const handleGenerateInvoice = (order: IOrder) => {
    window.open(`/api/orders/${order._id}/invoice`, "_blank");
  };

  const openStatusEditor = (order: IOrder) => {
    setEditingStatus(order);
    setNewStatus(order.orderStatus);
    setTracking(order.trackingNumber || "");
  };

  const handleUpdateStatus = async () => {
    if (!editingStatus) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${editingStatus._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus, trackingNumber: tracking || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Update failed");
      setOrders((prev) => prev.map((o) => (o._id === editingStatus._id ? data.data : o)));

      // Notify customer on WhatsApp (wa.me mode opens a pre-filled chat to send).
      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank");
        toast.success("Status updated — WhatsApp opened to notify customer");
      } else {
        toast.success("Status updated & customer notified");
      }
      setEditingStatus(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to update");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (order: IOrder) => {
    if (!confirm(`Delete order ${order.orderNumber}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/orders/${order._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");
      setOrders((prev) => prev.filter((o) => o._id !== order._id));
      toast.success("Order deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete");
    }
  };

  const actions = (order: IOrder) => [
    { icon: Eye, label: "View", onClick: () => setSelected(order) },
    { icon: Pencil, label: "Status", onClick: () => openStatusEditor(order) },
    { icon: FileText, label: "Invoice", onClick: () => handleGenerateInvoice(order) },
    { icon: Copy, label: "Copy", onClick: () => handleCopyMessage(order) },
    { icon: MessageCircle, label: "Send Bill", onClick: () => handleOpenWhatsApp(order) },
    { icon: Trash2, label: "Delete", onClick: () => handleDelete(order), danger: true },
  ];

  return (
    <div>
      {/* Toolbar: search + filter tabs */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order #, name, phone..."
          className="w-full md:w-72 px-4 py-2.5 bg-white border border-border rounded-full text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
        />
        <div className="flex flex-wrap gap-2">
          <FilterTab label="All" active={filter === "all"} onClick={() => setFilter("all")} count={orders.length} />
          {ORDER_STATUSES.map((s) => (
            <FilterTab
              key={s}
              label={ORDER_STATUS_LABELS[s]}
              active={filter === s}
              onClick={() => setFilter(s)}
              count={orders.filter((o) => o.orderStatus === s).length}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-ivory/50">
          No orders found.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-sand/40 border-b border-border text-ivory/60">
                <tr>
                  <th className="px-5 py-3.5 text-left font-medium">Order</th>
                  <th className="px-5 py-3.5 text-left font-medium">Customer</th>
                  <th className="px-5 py-3.5 text-left font-medium">Items</th>
                  <th className="px-5 py-3.5 text-left font-medium">Total</th>
                  <th className="px-5 py-3.5 text-left font-medium">Date</th>
                  <th className="px-5 py-3.5 text-left font-medium">Status</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-sand/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-gold text-xs">{order.orderNumber}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-ivory">{order.customerName}</div>
                      <div className="text-ivory/45 text-xs">{order.phone}</div>
                    </td>
                    <td className="px-5 py-4 text-ivory/60">
                      {order.items.reduce((n, i) => n + i.quantity, 0)}
                    </td>
                    <td className="px-5 py-4 text-ivory font-semibold">{formatPrice(order.total)}</td>
                    <td className="px-5 py-4 text-ivory/55 whitespace-nowrap text-xs">{formatDateTime(order.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-medium border", getOrderStatusColor(order.orderStatus))}>
                        {ORDER_STATUS_LABELS[order.orderStatus]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {actions(order).map((a, i) => (
                          <IconBtn key={i} icon={a.icon} label={a.label} onClick={a.onClick} danger={a.danger} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filtered.map((order) => (
              <div key={order._id} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-mono text-gold text-xs">{order.orderNumber}</p>
                    <p className="font-medium mt-1">{order.customerName}</p>
                    <p className="text-ivory/45 text-xs">{order.phone}</p>
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap", getOrderStatusColor(order.orderStatus))}>
                    {ORDER_STATUS_LABELS[order.orderStatus]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-4 pb-3 border-b border-border">
                  <span className="text-ivory/50 text-xs">{formatDateTime(order.createdAt)}</span>
                  <span className="text-ivory font-semibold">{formatPrice(order.total)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {actions(order).map((a, i) => (
                    <button
                      key={i}
                      onClick={a.onClick}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border border-border transition-colors text-xs",
                        a.danger ? "hover:border-red-300 hover:bg-red-50 hover:text-red-600" : "hover:border-gold hover:bg-gold/5"
                      )}
                    >
                      <a.icon size={16} />
                      <span className="text-ivory/60">{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* View Details Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Order ${selected.orderNumber}`} size="lg">
          <div className="space-y-4 text-sm">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-gold font-semibold mb-1">Customer</h4>
                <p className="text-ivory">{selected.customerName}</p>
                <p className="text-ivory/60">{selected.phone}</p>
                {selected.email && <p className="text-ivory/60">{selected.email}</p>}
              </div>
              <div>
                <h4 className="text-gold font-semibold mb-1">Shipping Address</h4>
                <p className="text-ivory/70">{selected.address}, {selected.city}, {selected.state} - {selected.pincode}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs text-ivory/50 border-y border-border py-3">
              <div>
                <span className="text-ivory/40">Placed:</span> {formatDateTime(selected.createdAt)}
              </div>
              {selected.updatedAt && (
                <div>
                  <span className="text-ivory/40">Last updated:</span> {formatDateTime(selected.updatedAt)}
                </div>
              )}
            </div>
            {selected.notes && (
              <div>
                <h4 className="text-gold font-semibold mb-1">Notes</h4>
                <p className="text-ivory/70">{selected.notes}</p>
              </div>
            )}
            <div>
              <h4 className="text-gold font-semibold mb-2">Items</h4>
              <div className="space-y-2">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-border pb-2">
                    <span className="text-ivory">{item.productName || item.name} × {item.quantity}</span>
                    <span className="text-ivory">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1 pt-2">
              <div className="flex justify-between"><span className="text-ivory/60">Subtotal</span><span>{formatPrice(selected.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-ivory/60">Shipping</span><span>{selected.shipping === 0 ? "FREE" : formatPrice(selected.shipping)}</span></div>
              {selected.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(selected.discount)}</span></div>}
              <div className="flex justify-between text-lg font-bold text-gold pt-2 border-t border-border"><span>Total</span><span>{formatPrice(selected.total)}</span></div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button size="sm" onClick={() => handleGenerateInvoice(selected)}>Generate Invoice</Button>
              <Button size="sm" variant="secondary" onClick={() => handleOpenWhatsApp(selected)}>Send Bill &amp; QR</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Status Modal */}
      {editingStatus && (
        <Modal isOpen={!!editingStatus} onClose={() => setEditingStatus(null)} title={`Update — ${editingStatus.orderNumber}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tracking Number (optional)</label>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="e.g. DELHIVERY123456"
                className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingStatus(null)}>Cancel</Button>
              <Button size="sm" onClick={handleUpdateStatus} isLoading={busy}>Save</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function FilterTab({ label, active, onClick, count }: { label: string; active: boolean; onClick: () => void; count: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
        active ? "bg-gold text-white border-gold" : "bg-white border-border text-ivory/60 hover:border-gold/50 hover:text-ivory"
      )}
    >
      {label} <span className="opacity-60">({count})</span>
    </button>
  );
}

function IconBtn({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center text-ivory/55 transition-colors",
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-gold/10 hover:text-gold"
      )}
    >
      <Icon size={16} />
    </button>
  );
}
