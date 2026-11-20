import type { MetadataRoute } from "next";
import { store } from "@/config/store";

export default function robots(): MetadataRoute.Robots {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || store.siteUrl).replace(/\/+$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/cart", "/checkout", "/order/"] }],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
