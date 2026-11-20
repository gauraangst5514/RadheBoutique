import { NextResponse } from "next/server";
import { razorpayEnabled } from "@/lib/razorpay";

export async function GET() {
  return NextResponse.json({ razorpay: razorpayEnabled });
}
