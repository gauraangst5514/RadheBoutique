import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(amount: number, orderId: string) {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: orderId,
      notes: {
        order_id: orderId,
      },
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw new Error("Failed to create payment order");
  }
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    return generatedSignature === signature;
  } catch (error) {
    console.error("Razorpay signature verification error:", error);
    return false;
  }
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    return false;
  }
}

export default razorpay;
