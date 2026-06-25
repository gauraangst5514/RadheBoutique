import { Resend } from "resend";
import { IOrder, IOrderItem } from "@/types";
import { formatPrice, formatDate } from "./utils";

const resend = new Resend(process.env.RESEND_API_KEY);
// Resend requires a verified domain. Default to their shared test sender
// (onboarding@resend.dev) until your own domain is verified in Resend.
const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Radhe Boutique";

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: `${brandName} <${fromEmail}>`,
      to: email,
      subject: `Welcome to ${brandName}!`,
      html: getWelcomeEmailTemplate(name),
    });
  } catch (error) {
    console.error("Welcome email error:", error);
  }
}

export async function sendOrderConfirmationEmail(email: string, order: IOrder) {
  try {
    await resend.emails.send({
      from: `${brandName} <${fromEmail}>`,
      to: email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: getOrderConfirmationTemplate(order),
    });
  } catch (error) {
    console.error("Order confirmation email error:", error);
  }
}

/**
 * Emails the customer their invoice/bill as an HTML document on order placement.
 */
export async function sendInvoiceEmail(email: string, order: IOrder, invoiceHtml: string) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invoiceLink = `${appUrl}/api/invoice/${order.orderNumber}`;

    await resend.emails.send({
      from: `${brandName} <${fromEmail}>`,
      to: email,
      subject: `Your Invoice - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto;">
          <p>Dear ${order.customerName},</p>
          <p>Thank you for your order with <strong>${brandName}</strong>. Your invoice is attached below.</p>
          <p>You can also view or download it any time here:
            <a href="${invoiceLink}" style="color:#a67c52;">${invoiceLink}</a>
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
          ${invoiceHtml}
        </div>
      `,
    });
  } catch (error) {
    console.error("Invoice email error:", error);
  }
}

export async function sendOrderShippedEmail(
  email: string,
  order: IOrder,
  trackingNumber: string
) {
  try {
    await resend.emails.send({
      from: `${brandName} <${fromEmail}>`,
      to: email,
      subject: `Your Order has been Shipped - ${order._id}`,
      html: getOrderShippedTemplate(order, trackingNumber),
    });
  } catch (error) {
    console.error("Order shipped email error:", error);
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

  try {
    await resend.emails.send({
      from: `${brandName} <${fromEmail}>`,
      to: email,
      subject: "Password Reset Request",
      html: getPasswordResetTemplate(resetUrl),
    });
  } catch (error) {
    console.error("Password reset email error:", error);
  }
}

function getWelcomeEmailTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Montserrat', sans-serif; background-color: #0A0A0A; color: #FAF7F0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: #C9A84C; }
        .content { background-color: #141414; padding: 40px; border-radius: 8px; margin: 20px 0; }
        h1 { font-family: 'Cormorant Garamond', serif; color: #C9A84C; font-size: 28px; margin-bottom: 20px; }
        p { line-height: 1.6; color: #FAF7F0; margin-bottom: 15px; }
        .button { display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${brandName}</div>
        </div>
        <div class="content">
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for joining ${brandName}. We're thrilled to have you as part of our exclusive community.</p>
          <p>Discover our collection of handcrafted jewellery, each piece designed with elegance and crafted for eternity.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" class="button">Explore Collections</a>
          <p>If you have any questions, feel free to reach out to us at ${fromEmail}.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getOrderConfirmationTemplate(order: IOrder): string {
  const itemsHtml = (order.items as IOrderItem[])
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #2A2A2A;">
        ${item.name} x ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #2A2A2A; text-align: right;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Montserrat', sans-serif; background-color: #0A0A0A; color: #FAF7F0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: #C9A84C; }
        .content { background-color: #141414; padding: 40px; border-radius: 8px; margin: 20px 0; }
        h1 { font-family: 'Cormorant Garamond', serif; color: #C9A84C; font-size: 28px; margin-bottom: 20px; }
        p { line-height: 1.6; color: #FAF7F0; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .total-row { font-weight: bold; font-size: 18px; }
        .button { display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${brandName}</div>
        </div>
        <div class="content">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order. We're preparing your items for shipment.</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Date:</strong> ${formatDate(order.createdAt)}</p>
          
          <h2 style="color: #C9A84C; margin-top: 30px;">Order Items</h2>
          <table>
            ${itemsHtml}
            <tr>
              <td style="padding: 10px;">Subtotal</td>
              <td style="padding: 10px; text-align: right;">${formatPrice(order.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 10px;">Shipping</td>
              <td style="padding: 10px; text-align: right;">${formatPrice(order.shipping)}</td>
            </tr>
            ${
              order.discount > 0
                ? `<tr>
              <td style="padding: 10px;">Discount</td>
              <td style="padding: 10px; text-align: right; color: #C9A84C;">-${formatPrice(order.discount)}</td>
            </tr>`
                : ""
            }
            <tr class="total-row">
              <td style="padding: 15px; border-top: 2px solid #C9A84C;">Total</td>
              <td style="padding: 15px; text-align: right; border-top: 2px solid #C9A84C;">${formatPrice(order.total)}</td>
            </tr>
          </table>
          
          <h2 style="color: #C9A84C; margin-top: 30px;">Delivery Address</h2>
          <p>
            ${order.customerName}<br>
            ${order.phone}<br>
            ${order.address}<br>
            ${order.city}, ${order.state} - ${order.pincode}
          </p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order._id}" class="button">Track Order</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getOrderShippedTemplate(order: IOrder, trackingNumber: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Montserrat', sans-serif; background-color: #0A0A0A; color: #FAF7F0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: #C9A84C; }
        .content { background-color: #141414; padding: 40px; border-radius: 8px; margin: 20px 0; }
        h1 { font-family: 'Cormorant Garamond', serif; color: #C9A84C; font-size: 28px; margin-bottom: 20px; }
        p { line-height: 1.6; color: #FAF7F0; margin-bottom: 15px; }
        .tracking { background-color: #0A0A0A; padding: 20px; border-radius: 4px; text-align: center; margin: 20px 0; }
        .tracking-number { font-size: 24px; color: #C9A84C; font-weight: bold; letter-spacing: 2px; }
        .button { display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${brandName}</div>
        </div>
        <div class="content">
          <h1>Your Order is On Its Way!</h1>
          <p>Great news! Your order has been shipped and is on its way to you.</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          
          <div class="tracking">
            <p style="margin-bottom: 10px; color: #888;">Tracking Number</p>
            <div class="tracking-number">${trackingNumber}</div>
          </div>
          
          <p>You can track your shipment using the tracking number above. Your order should arrive within 5-7 business days.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${order._id}" class="button">View Order Details</a>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getPasswordResetTemplate(resetUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Montserrat', sans-serif; background-color: #0A0A0A; color: #FAF7F0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 20px 0; }
        .logo { font-family: 'Cormorant Garamond', serif; font-size: 32px; color: #C9A84C; }
        .content { background-color: #141414; padding: 40px; border-radius: 8px; margin: 20px 0; }
        h1 { font-family: 'Cormorant Garamond', serif; color: #C9A84C; font-size: 28px; margin-bottom: 20px; }
        p { line-height: 1.6; color: #FAF7F0; margin-bottom: 15px; }
        .button { display: inline-block; background-color: #C9A84C; color: #0A0A0A; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; font-weight: 600; }
        .warning { background-color: #2A2A2A; padding: 15px; border-radius: 4px; border-left: 4px solid #C9A84C; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">${brandName}</div>
        </div>
        <div class="content">
          <h1>Password Reset Request</h1>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <a href="${resetUrl}" class="button">Reset Password</a>
          
          <div class="warning">
            <p style="margin: 0;"><strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.</p>
          </div>
          
          <p>If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #C9A84C;">${resetUrl}</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default resend;
