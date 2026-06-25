import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { generateOrderNumber } from "@/lib/orderNumber";
import { CreateOrderPayload, IOrder, OrderStatus, PaymentStatus } from "@/types";

const FREE_SHIPPING_THRESHOLD = 5000;

interface BuiltOrderItem {
  productId: any;
  productName: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  subtotal: number;
  metal?: string;
}

/**
 * Validates stock, prices items from the DB (never trust client prices),
 * decrements stock, and persists the order with status "pending_payment".
 */
export async function createOrder(payload: CreateOrderPayload): Promise<IOrder> {
  await connectDB();

  const builtItems: BuiltOrderItem[] = [];
  let subtotal = 0;

  for (const item of payload.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }
    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    const price = product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price;
    const lineTotal = price * item.quantity;

    builtItems.push({
      productId: product._id,
      productName: product.name,
      name: product.name,
      image: product.images?.[0]?.url || "",
      price,
      quantity: item.quantity,
      subtotal: lineTotal,
      metal: item.metal || product.metal,
    });

    subtotal += lineTotal;

    product.stock -= item.quantity;
    await product.save();
  }

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : payload.shippingMethod === "express"
      ? 199
      : 99;

  const discount = 0; // coupon application handled separately if needed
  const total = subtotal + shipping - discount;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    customerName: payload.customerName,
    phone: payload.phone,
    email: payload.email || undefined,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    pincode: payload.pincode,
    notes: payload.notes || undefined,
    items: builtItems,
    subtotal,
    shipping,
    discount,
    total,
    couponCode: payload.couponCode || undefined,
    paymentStatus: "pending",
    orderStatus: "pending_payment",
  });

  return JSON.parse(JSON.stringify(order));
}

export async function getOrders(filter: Record<string, any> = {}): Promise<IOrder[]> {
  await connectDB();
  const orders = await Order.find(filter).sort("-createdAt").lean();
  return JSON.parse(JSON.stringify(orders));
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  await connectDB();
  const order = await Order.findById(id).lean();
  return order ? JSON.parse(JSON.stringify(order)) : null;
}

/**
 * Keeps paymentStatus in sync with orderStatus when not explicitly provided.
 */
export async function updateOrderStatus(
  id: string,
  updates: {
    orderStatus: OrderStatus;
    paymentStatus?: PaymentStatus;
    trackingNumber?: string;
  }
): Promise<IOrder | null> {
  await connectDB();

  const derivedPayment: PaymentStatus | undefined =
    updates.paymentStatus ??
    (["paid", "packed", "shipped", "delivered"].includes(updates.orderStatus)
      ? "paid"
      : updates.orderStatus === "pending_payment"
      ? "pending"
      : undefined);

  const order = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: updates.orderStatus,
      ...(derivedPayment ? { paymentStatus: derivedPayment } : {}),
      ...(updates.trackingNumber !== undefined
        ? { trackingNumber: updates.trackingNumber }
        : {}),
    },
    { new: true, runValidators: true }
  ).lean();

  return order ? JSON.parse(JSON.stringify(order)) : null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  await connectDB();
  const result = await Order.findByIdAndDelete(id);
  return !!result;
}

export interface OrderStats {
  total: number;
  pending_payment: number;
  paid: number;
  packed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  revenue: number;
}

export async function getOrderStats(): Promise<OrderStats> {
  await connectDB();

  const [counts, revenueAgg] = await Promise.all([
    Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);

  const stats: OrderStats = {
    total: 0,
    pending_payment: 0,
    paid: 0,
    packed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: revenueAgg[0]?.total || 0,
  };

  for (const row of counts) {
    const key = row._id as keyof OrderStats;
    if (key in stats) {
      (stats[key] as number) = row.count;
    }
    stats.total += row.count;
  }

  return stats;
}
