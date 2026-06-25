import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrderById, deleteOrder } from "@/lib/services/orderService";
import { isValidObjectId } from "@/lib/utils";

/**
 * GET /api/orders/:id
 * Admin only (used by the admin order-detail view).
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
      return NextResponse.json(
        { success: false, error: "Invalid order id" },
        { status: 400 }
      );
    }

    const order = await getOrderById(params.id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/orders/:id  (admin only)
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, error: "Invalid order id" },
        { status: 400 }
      );
    }

    const deleted = await deleteOrder(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (error: any) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
