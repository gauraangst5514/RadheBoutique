import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { invoiceService } from "@/lib/invoice";

/**
 * GET /api/invoice/:orderNumber  (public)
 * Returns a printable HTML invoice for a given order number.
 * The order number acts as the access key (random + unguessable),
 * letting customers download their own bill without an account.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    await connectDB();

    const order = await Order.findOne({ orderNumber: params.orderNumber }).lean();
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const plain = JSON.parse(JSON.stringify(order));
    const result = await invoiceService.generate(plain);
    if (!result.success || !result.html) {
      return NextResponse.json({ success: false, error: "Failed to generate invoice" }, { status: 500 });
    }

    return new NextResponse(result.html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("Public invoice error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate invoice" }, { status: 500 });
  }
}
