import { IWhatsAppProvider, WhatsAppMessagePayload, WhatsAppSendResult } from "../types";
import { normalizePhone } from "../messageBuilder";

/**
 * FUTURE implementation: official WhatsApp Business Cloud API.
 *
 * To activate, set in .env:
 *   WHATSAPP_PROVIDER=api
 *   WHATSAPP_API_TOKEN=...
 *   WHATSAPP_PHONE_NUMBER_ID=...
 *
 * The contract is identical to WaMeProvider, so no caller changes are needed.
 */
export class WhatsAppApiProvider implements IWhatsAppProvider {
  private token = process.env.WHATSAPP_API_TOKEN;
  private phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  private apiVersion = process.env.WHATSAPP_API_VERSION || "v21.0";

  async send(payload: WhatsAppMessagePayload): Promise<WhatsAppSendResult> {
    if (!this.token || !this.phoneNumberId) {
      return {
        success: false,
        error: "WhatsApp Business API not configured (missing token/phone number id)",
      };
    }

    try {
      const to = normalizePhone(payload.to);
      const res = await fetch(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: payload.body },
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data?.error?.message || "WhatsApp API error" };
      }

      return { success: true, messageId: data?.messages?.[0]?.id };
    } catch (error: any) {
      return { success: false, error: error?.message || "WhatsApp API request failed" };
    }
  }
}
