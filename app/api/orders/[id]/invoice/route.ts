import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/lib/services/orderService";
import { invoiceService } from "@/lib/invoice";
import { isValidObjectId } from "@/lib/utils";

/**
 * GET /api/orders/:id/invoice  (admin only)
 * Returns a printable HTML invoice (modular — swap to PDF later).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
    }

    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const result = await invoiceService.generate(order);
    if (!result.success || !result.html) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to generate invoice" },
        { status: 500 }
      );
    }

    return new NextResponse(result.html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("Invoice error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
