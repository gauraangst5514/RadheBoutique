import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateOrderStatusSchema } from "@/lib/validations";
import { updateOrderStatus } from "@/lib/services/orderService";
import { isValidObjectId } from "@/lib/utils";
import { whatsAppService } from "@/lib/whatsapp";

/**
 * PATCH /api/orders/:id/status  (admin only)
 * Updates orderStatus (+ derived paymentStatus / tracking number),
 * then notifies the customer via WhatsApp:
 *   - wa.me mode: returns a pre-filled wa.me URL for the admin to send (auto-opened client-side)
 *   - api mode:   sends automatically via the Business API
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ success: false, error: "Invalid order id" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 });
    }

    const order = await updateOrderStatus(params.id, parsed.data);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Notify customer of the status change.
    let whatsappUrl: string | undefined;
    try {
      const result = await whatsAppService.sendOrderMessage(order, "status_update");
      whatsappUrl = result.url; // present in wa.me mode
    } catch (e) {
      console.error("WhatsApp status notification error:", e);
    }

    return NextResponse.json({ success: true, data: order, whatsappUrl });
  } catch (error: any) {
    console.error("Update order status error:", error);
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}
