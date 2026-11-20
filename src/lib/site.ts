import "server-only";
import { store } from "@/config/store";

/**
 * The site's public address, e.g. "https://radhe-boutique.vercel.app" (no trailing slash).
 * Used for links in WhatsApp messages, so WhatsApp can show the product photo as a preview.
 * Order: NEXT_PUBLIC_SITE_URL, then the address the request came in on, then Vercel's own URLs.
 */
export function siteUrl(from?: { headers: Headers } | Headers): string {
  const env = (process.env.NEXT_PUBLIC_SITE_URL || store.siteUrl)?.trim().replace(/\/+$/, "");
  if (env) return env.includes("://") ? env : `https://${env}`;
  const h = from instanceof Headers ? from : from?.headers;
  const host = h?.get("x-forwarded-host") || h?.get("host");
  if (host) {
    const proto = h?.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return vercel ? `https://${vercel}` : "";
}
