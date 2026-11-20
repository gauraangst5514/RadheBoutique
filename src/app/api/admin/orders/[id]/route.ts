import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { stockLines } from "@/lib/orders";

const schema = z.object({ action: z.enum(["confirm", "ship", "deliver", "cancel"]) });

/**
 * confirm: a WhatsApp order the customer confirmed in chat → takes online stock.
 * cancel: puts stock back if this order had taken it.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Please log in again" }, { status: 401 });
  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  const order = await db.getOrder(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  switch (parsed.data.action) {
    case "confirm": {
      if (order.stockApplied) return NextResponse.json({ order: await db.updateOrder(id, { status: "confirmed" }) });
      const taken = await db.takeStock(stockLines(order));
      if (!taken.ok) return NextResponse.json({ error: "Not enough online stock for this order. Update stock first." }, { status: 409 });
      return NextResponse.json({ order: await db.updateOrder(id, { status: "confirmed", stockApplied: true }) });
    }
    case "ship":
      return NextResponse.json({ order: await db.updateOrder(id, { status: "shipped" }) });
    case "deliver":
      return NextResponse.json({ order: await db.updateOrder(id, { status: "delivered" }) });
    case "cancel": {
      if (order.stockApplied) await db.returnStock(stockLines(order));
      return NextResponse.json({ order: await db.updateOrder(id, { status: "cancelled", stockApplied: false }) });
    }
  }
}
