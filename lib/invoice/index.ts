import { IInvoiceGenerator } from "./types";
import { HtmlInvoiceGenerator } from "./HtmlInvoiceGenerator";

export * from "./types";
export { HtmlInvoiceGenerator } from "./HtmlInvoiceGenerator";

/**
 * Returns the active invoice generator.
 * Switch INVOICE_FORMAT=pdf in future to return a PdfInvoiceGenerator
 * without changing any caller.
 */
export function getInvoiceGenerator(): IInvoiceGenerator {
  // const format = process.env.INVOICE_FORMAT || "html";
  // if (format === "pdf") return new PdfInvoiceGenerator();
  return new HtmlInvoiceGenerator();
}

export const invoiceService = getInvoiceGenerator();
