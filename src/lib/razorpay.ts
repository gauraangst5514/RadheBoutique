import "server-only";
import Razorpay from "razorpay";

export const razorpayEnabled = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

let instance: Razorpay | null = null;
export function razorpay() {
  if (!razorpayEnabled) throw new Error("Razorpay keys are not set");
  if (!instance) instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });
  return instance;
}
