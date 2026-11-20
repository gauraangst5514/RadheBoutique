import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

/** Download every order as a CSV that opens in Excel or Google Sheets. */
export async function GET() {
  if (!(await isAdmin())) return new Response("Please log in", { status: 401 });
  const orders = await db.listOrders(5000);
  const cell = (v: unknown) => {
    const s = v == null ? "" : String(v);
    // Quote everything; neutralise spreadsheet formulas.
    return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
  };
  const head = ["Order", "Date (IST)", "Status", "Payment", "Name", "Phone", "Address", "City", "State", "Pincode", "Items", "Subtotal", "Discount", "Shipping", "Total"];
  const rows = orders.map((o) => [
    o.number,
    new Date(o.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    o.status,
    o.paymentMethod,
    o.customer.name,
    o.customer.phone,
    o.customer.address,
    o.customer.city,
    o.customer.state,
    o.customer.pincode,
    o.items.map((i) => `${i.name} (${i.variantName}) x${i.qty}`).join("; "),
    o.subtotal,
    o.discount,
    o.shipping,
    o.total,
  ]);
  const csv = "﻿" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="radhe-orders-${date}.csv"`,
      "cache-control": "no-store",
    },
  });
}
