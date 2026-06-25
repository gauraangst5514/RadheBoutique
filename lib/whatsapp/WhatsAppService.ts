import { IOrder } from "@/types";
import { IWhatsAppProvider, WhatsAppSendResult, WhatsAppTemplate } from "./types";
import { WaMeProvider } from "./providers/WaMeProvider";
import { WhatsAppApiProvider } from "./providers/WhatsAppApiProvider";
import { buildMessage, normalizePhone } from "./messageBuilder";

/**
 * High-level service used across the app.
 *
 * Today it delegates to the wa.me strategy (`sendViaWaMe`).
 * Tomorrow, set WHATSAPP_PROVIDER=api to delegate to the Business API
 * (`sendViaWhatsAppApi`) — callers stay unchanged.
 */
export class WhatsAppService {
  private provider: IWhatsAppProvider;

  constructor(provider?: IWhatsAppProvider) {
    if (provider) {
      this.provider = provider;
    } else {
      const mode = process.env.WHATSAPP_PROVIDER || "wa_me";
      this.provider = mode === "api" ? new WhatsAppApiProvider() : new WaMeProvider();
    }
  }

  /** Build the message body for a given order + template. */
  buildOrderMessage(order: IOrder, template: WhatsAppTemplate): string {
    return buildMessage(order, template);
  }

  /** Generic send via the active provider. */
  async send(to: string, body: string): Promise<WhatsAppSendResult> {
    return this.provider.send({ to, body });
  }

  /** Send (or build link for) a templated order message. */
  async sendOrderMessage(
    order: IOrder,
    template: WhatsAppTemplate,
    overridePhone?: string
  ): Promise<WhatsAppSendResult> {
    const to = overridePhone || order.phone;
    const body = this.buildOrderMessage(order, template);
    return this.provider.send({ to, body });
  }

  // --- Explicit strategy helpers (per the spec) ---

  /** Current implementation: returns a wa.me deep link. */
  async sendViaWaMe(order: IOrder, template: WhatsAppTemplate): Promise<WhatsAppSendResult> {
    const provider = new WaMeProvider();
    return provider.send({ to: order.phone, body: this.buildOrderMessage(order, template) });
  }

  /** Future implementation: sends through the WhatsApp Business API. */
  async sendViaWhatsAppApi(
    order: IOrder,
    template: WhatsAppTemplate
  ): Promise<WhatsAppSendResult> {
    const provider = new WhatsAppApiProvider();
    return provider.send({ to: order.phone, body: this.buildOrderMessage(order, template) });
  }

  /** Build a wa.me URL directly (handy for client buttons). */
  buildWaMeUrl(phone: string, body: string): string {
    return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(body)}`;
  }
}

// Singleton for convenience.
export const whatsAppService = new WhatsAppService();
