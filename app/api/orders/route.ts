import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations";
import { createOrder, getOrders } from "@/lib/services/orderService";
import { whatsAppService } from "@/lib/whatsapp";
import { invoiceService } from "@/lib/invoice";
import { sendInvoiceEmail } from "@/lib/email";

/**
 * POST /api/orders
 * Public — guests can place orders (no payment gateway).
 * Returns the created order + a ready-to-open wa.me URL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const order = await createOrder(parsed.data);

    // Email the invoice/bill to the customer if they provided an email.
    if (order.email) {
      invoiceService
        .generate(order)
        .then((res) => {
          if (res.success && res.html) {
            return sendInvoiceEmail(order.email!, order, res.html);
          }
        })
        .catch((e) => console.error("Invoice email failed:", e));
    }

    // Build wa.me link so the customer can message the store with order details.
    const storeNumber =
      process.env.NEXT_PUBLIC_BRAND_WHATSAPP?.replace(/\D/g, "") || "919876543210";
    const body_ = whatsAppService.buildOrderMessage(order, "order_placed");
    const whatsappUrl = whatsAppService.buildWaMeUrl(storeNumber, body_);

    // Public invoice link the customer can download.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invoiceUrl = `${appUrl}/api/invoice/${order.orderNumber}`;

    return NextResponse.json(
      { success: true, data: { order, whatsappUrl, invoiceUrl } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Admin: all orders. Regular user: their own (by email/phone match not needed —
 * admin-only listing for the management panel).
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
