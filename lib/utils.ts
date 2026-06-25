import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function calculateDiscount(price: number, salePrice?: number): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function getDisplayPrice(price: number, salePrice?: number): number {
  return salePrice && salePrice < price ? salePrice : price;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
}

export function validatePincode(pincode: string): boolean {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
}

export function calculateShipping(subtotal: number, method: "standard" | "express"): number {
  if (subtotal >= 5000) return 0;
  return method === "express" ? 199 : 99;
}

export function applyCouponDiscount(
  subtotal: number,
  couponType: "percentage" | "flat",
  couponValue: number
): number {
  if (couponType === "percentage") {
    return Math.round((subtotal * couponValue) / 100);
  }
  return couponValue;
}

export function getMetalLabel(metal: string): string {
  const labels: Record<string, string> = {
    gold: "Gold",
    silver: "Silver",
    platinum: "Platinum",
    "rose-gold": "Rose Gold",
  };
  return labels[metal] || metal;
}

export function getStoneLabel(stone: string): string {
  const labels: Record<string, string> = {
    diamond: "Diamond",
    ruby: "Ruby",
    emerald: "Emerald",
    sapphire: "Sapphire",
    none: "No Stone",
    other: "Other",
  };
  return labels[stone] || stone;
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending_payment: "text-amber-700 bg-amber-100 border-amber-200",
    paid: "text-blue-700 bg-blue-100 border-blue-200",
    packed: "text-purple-700 bg-purple-100 border-purple-200",
    shipped: "text-cyan-700 bg-cyan-100 border-cyan-200",
    delivered: "text-green-700 bg-green-100 border-green-200",
    cancelled: "text-red-700 bg-red-100 border-red-200",
  };
  return colors[status] || "text-gray-700 bg-gray-100 border-gray-200";
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-100",
    completed: "text-green-600 bg-green-100",
    failed: "text-red-600 bg-red-100",
    refunded: "text-orange-600 bg-orange-100",
  };
  return colors[status] || "text-gray-600 bg-gray-100";
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function isValidObjectId(id: string): boolean {
  return /^[a-f\d]{24}$/i.test(id);
}
