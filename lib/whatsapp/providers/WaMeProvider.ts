import { IWhatsAppProvider, WhatsAppMessagePayload, WhatsAppSendResult } from "../types";
import { normalizePhone } from "../messageBuilder";

/**
 * Current implementation: builds a wa.me deep link.
 * No server-side sending — the client opens the returned URL.
 */
export class WaMeProvider implements IWhatsAppProvider {
  async send(payload: WhatsAppMessagePayload): Promise<WhatsAppSendResult> {
    try {
      const phone = normalizePhone(payload.to);
      if (!phone) {
        return { success: false, error: "Invalid phone number" };
      }

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(payload.body)}`;
      return { success: true, url };
    } catch (error: any) {
      return { success: false, error: error?.message || "Failed to build wa.me link" };
    }
  }
}
