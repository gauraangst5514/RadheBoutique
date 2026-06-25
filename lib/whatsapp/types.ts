import { IOrder } from "@/types";

/**
 * Result returned by any WhatsApp delivery strategy.
 * - `url` is set for the wa.me strategy (client opens it).
 * - `messageId` is set when using the official Business API.
 */
export interface WhatsAppSendResult {
  success: boolean;
  /** Pre-built wa.me deep link (wa.me strategy). */
  url?: string;
  /** Message id returned by the Business API (future). */
  messageId?: string;
  error?: string;
}

export interface WhatsAppMessagePayload {
  /** Recipient phone in international format without symbols, e.g. 919876543210 */
  to: string;
  /** Plain-text message body. */
  body: string;
}

/**
 * Contract every WhatsApp provider must implement.
 * Swap the concrete implementation without touching callers.
 */
export interface IWhatsAppProvider {
  send(payload: WhatsAppMessagePayload): Promise<WhatsAppSendResult>;
}

/** Message kinds the service knows how to build. */
export type WhatsAppTemplate = "order_placed" | "payment_request" | "status_update";

export interface BuildMessageOptions {
  order: IOrder;
  template: WhatsAppTemplate;
}
