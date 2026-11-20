import { NextResponse } from "next/server";
import { razorpayEnabled } from "@/lib/razorpay";
import { store } from "@/config/store";

export async function GET() {
  // Online payment shows only when it's switched on in store.ts AND the Razorpay keys are set.
  return NextResponse.json({ razorpay: store.onlinePayments && razorpayEnabled });
}
