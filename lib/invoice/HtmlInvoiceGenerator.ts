import { IOrder, ORDER_STATUS_LABELS } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { IInvoiceGenerator, InvoiceResult } from "./types";

const BRAND = process.env.NEXT_PUBLIC_BRAND_NAME || "Radhe Boutique";
const BRAND_EMAIL = process.env.NEXT_PUBLIC_BRAND_EMAIL || "info@radheboutique.com";
const BRAND_PHONE = process.env.NEXT_PUBLIC_BRAND_WHATSAPP || "+919876543210";

/**
 * Current invoice implementation: returns a self-contained, printable HTML document.
 * Swap to a PdfInvoiceGenerator later without changing callers.
 */
export class HtmlInvoiceGenerator implements IInvoiceGenerator {
  async generate(order: IOrder): Promise<InvoiceResult> {
    try {
      const rows = order.items
        .map(
          (item) => `
          <tr>
            <td>${item.productName || item.name}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">${formatPrice(item.price)}</td>
            <td style="text-align:right;">${formatPrice(item.price * item.quantity)}</td>
          </tr>`
        )
        .join("");

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Invoice ${order.orderNumber}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; margin: 0; padding: 40px; background:#fff; }
  .invoice { max-width: 800px; margin: 0 auto; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom: 3px solid #C9A84C; padding-bottom: 20px; }
  .brand { font-size: 28px; font-weight: bold; color: #C9A84C; }
  .brand small { display:block; font-size:12px; color:#666; font-weight:normal; }
  .meta { text-align:right; font-size: 13px; color:#555; }
  .meta strong { color:#1a1a1a; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color:#888; margin: 24px 0 8px; }
  .grid { display:flex; gap: 40px; }
  .grid > div { flex:1; font-size: 14px; line-height: 1.6; }
  table { width:100%; border-collapse: collapse; margin-top: 8px; font-size: 14px; }
  th { background:#0A0A0A; color:#fff; padding: 10px; text-align:left; }
  th:last-child, td:last-child { text-align:right; }
  td { padding: 10px; border-bottom: 1px solid #eee; }
  .totals { margin-top: 16px; margin-left:auto; width: 280px; font-size: 14px; }
  .totals div { display:flex; justify-content:space-between; padding: 6px 0; }
  .totals .grand { border-top: 2px solid #C9A84C; margin-top:6px; padding-top:10px; font-size: 18px; font-weight: bold; color:#C9A84C; }
  .badge { display:inline-block; padding: 4px 12px; border-radius: 4px; font-size:12px; background:#fef3c7; color:#92400e; }
  .footer { margin-top: 40px; text-align:center; font-size:12px; color:#999; border-top:1px solid #eee; padding-top: 20px; }
  @media print { body { padding: 0; } .no-print { display:none; } }
</style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="brand">${BRAND}<small>Crafted for Eternity</small></div>
      <div class="meta">
        <div><strong>INVOICE</strong></div>
        <div>Order: <strong>${order.orderNumber}</strong></div>
        <div>Date: ${formatDate(order.createdAt)}</div>
        <div>Status: <span class="badge">${ORDER_STATUS_LABELS[order.orderStatus]}</span></div>
      </div>
    </div>

    <div class="grid">
      <div>
        <h2>Billed To</h2>
        ${order.customerName}<br/>
        ${order.phone}<br/>
        ${order.email ? order.email + "<br/>" : ""}
        ${order.address}<br/>
        ${order.city}, ${order.state} - ${order.pincode}
      </div>
      <div>
        <h2>From</h2>
        ${BRAND}<br/>
        ${BRAND_EMAIL}<br/>
        ${BRAND_PHONE}
      </div>
    </div>

    <h2>Items</h2>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Price</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="totals">
      <div><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
      <div><span>Shipping</span><span>${order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span></div>
      ${order.discount > 0 ? `<div><span>Discount</span><span>-${formatPrice(order.discount)}</span></div>` : ""}
      <div class="grand"><span>Total</span><span>${formatPrice(order.total)}</span></div>
    </div>

    ${order.notes ? `<h2>Notes</h2><p style="font-size:14px;">${order.notes}</p>` : ""}

    <div class="footer">
      This is a computer-generated invoice. Payment is collected manually via WhatsApp.<br/>
      Thank you for shopping with ${BRAND}.
    </div>
  </div>
  <script>window.onload = () => { if (!window.location.hash.includes('noprint')) window.print(); }</script>
</body>
</html>`;

      return { success: true, html };
    } catch (error: any) {
      return { success: false, error: error?.message || "Failed to generate invoice" };
    }
  }
}
