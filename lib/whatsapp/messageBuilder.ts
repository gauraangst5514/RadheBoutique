import { IOrder } from "@/types";
import { formatPrice } from "@/lib/utils";
import { WhatsAppTemplate } from "./types";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Radhe Boutique";

function formatItems(order: IOrder): string {
  return order.items
    .map((item) => `- ${item.productName || item.name} x ${item.quantity}`)
    .join("\n");
}

function formatFullAddress(order: IOrder): string {
  return `${order.address}, ${order.city}, ${order.state} - ${order.pincode}`;
}

/**
 * Message sent FROM the customer TO the store after placing an order.
 * Used for the checkout -> wa.me redirect.
 */
function buildOrderPlacedMessage(order: IOrder): string {
  return [
    "Hello!",
    "",
    "I have placed an order.",
    "",
    `Order ID: ${order.orderNumber}`,
    `Name: ${order.customerName}`,
    `Phone: ${order.phone}`,
    "",
    "Items:",
    formatItems(order),
    "",
    `Total: ${formatPrice(order.total)}`,
    "",
    "Shipping Address:",
    formatFullAddress(order),
    "",
    "Please share the payment QR code.",
  ].join("\n");
}

/**
 * Message sent FROM the store TO the customer (admin "Open WhatsApp" action).
 * Includes payment instructions + thank you.
 */
function buildPaymentRequestMessage(order: IOrder): string {
  return [
    `Hello ${order.customerName},`,
    "",
    `Thank you for shopping with ${BRAND}!`,
    "",
    `Your order ${order.orderNumber} has been received.`,
    "",
    "Order Summary:",
    formatItems(order),
    "",
    `Invoice Amount: ${formatPrice(order.total)}`,
    "",
    "Payment Instructions:",
    "Please complete your payment using the QR code / UPI details shared by our team and reply with the payment screenshot to confirm.",
    "",
    "We'll pack and ship your order as soon as payment is confirmed.",
    "",
    `Thank you for choosing ${BRAND}! 💛`,
  ].join("\n");
}

/**
 * Friendly order status update sent FROM the store TO the customer.
 */
function buildStatusUpdateMessage(order: IOrder): string {
  const statusMessages: Record<string, string> = {
    pending: "We've received your order and are awaiting payment confirmation.",
    paid: "Your payment has been confirmed — thank you! We're now preparing your order.",
    packed: "Good news! Your order has been carefully packed and is ready for dispatch.",
    shipped: "Your order is on its way! 🚚",
    delivered: "Your order has been delivered. We hope you love it! 💛",
    cancelled: "Your order has been cancelled. Please reach out if you have any questions.",
  };

  const line = statusMessages[order.orderStatus] || "Your order status has been updated.";
  const lines = [
    `Hello ${order.customerName},`,
    "",
    `Update on your order ${order.orderNumber}:`,
    "",
    line,
  ];

  if (order.orderStatus === "shipped" && order.trackingNumber) {
    lines.push("", `Tracking Number: ${order.trackingNumber}`);
  }

  lines.push("", `Order Total: ${formatPrice(order.total)}`, "", `Thank you for choosing ${BRAND}! 💛`);
  return lines.join("\n");
}

export function buildMessage(order: IOrder, template: WhatsAppTemplate): string {
  switch (template) {
    case "order_placed":
      return buildOrderPlacedMessage(order);
    case "payment_request":
      return buildPaymentRequestMessage(order);
    case "status_update":
      return buildStatusUpdateMessage(order);
    default:
      return buildOrderPlacedMessage(order);
  }
}

/** Normalize a phone number to wa.me format (digits only, with country code). */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // If a 10-digit Indian number is passed, prefix country code 91.
  if (digits.length === 10) return `91${digits}`;
  return digits;
}
