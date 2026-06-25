import { IOrder } from "@/types";

export interface InvoiceResult {
  success: boolean;
  /** HTML invoice (current implementation). */
  html?: string;
  /** Buffer for PDF (future implementation). */
  pdf?: Buffer;
  error?: string;
}

/** Contract for any invoice generator (HTML now, PDF later). */
export interface IInvoiceGenerator {
  generate(order: IOrder): Promise<InvoiceResult>;
}
