import "server-only";
import { categories, type CategorySlug } from "@/config/store";

/**
 * The photo-to-listing pipeline. Each step is optional and switches on when its key is set:
 *  - REMOVE_BG_API_KEY → cut the product out of the background (keeps the real pixels;
 *    the site shows cut-outs on brand pink as the "studio shot").
 *  - ANTHROPIC_API_KEY → draft the title, Hinglish description and tags from the photo.
 * The jewellery itself is never redrawn by AI.
 */

export async function removeBackground(bytes: Uint8Array, type: string): Promise<Uint8Array | null> {
  const key = process.env.REMOVE_BG_API_KEY;
  if (!key) return null;
  const form = new FormData();
  form.append("image_file", new Blob([bytes as BlobPart], { type }), "photo");
  form.append("size", "auto");
  form.append("format", "png");
  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": key },
    body: form,
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) {
    console.warn("remove.bg failed", res.status, await res.text().catch(() => ""));
    return null;
  }
  return new Uint8Array(await res.arrayBuffer());
}

export interface ListingDraft {
  name: string;
  description: string;
  tags: string[];
  tryOn: "earrings" | "necklace" | null;
}

export async function draftListing(photo: { bytes: Uint8Array; type: string }, category: CategorySlug, price: number): Promise<ListingDraft | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const catName = categories.find((c) => c.slug === category)?.name ?? category;
  const prompt = `You write product listings for Radhe Boutique, a jewellery and kurti shop in Nashik that sells affordable anti-tarnish jewellery, Kashmiri/kundan earrings, hasli and necklace sets, and branded kurtis.
Look at the photo. Category: ${catName}. Price: ₹${price}.
Return ONLY a JSON object with:
- "name": a short product name customers would search for (max 6 words, Title Case, no price, no shop name)
- "description": 1–2 short sentences describing only what you can see (stones, colours, style), then one light Hinglish line like the shop's Instagram voice. Don't claim materials, weight or plating you can't see.
- "tags": 2–3 short tags (e.g. "Kundan", "Daily wear", "Festive")
- "tryOn": "earrings" if it is a pair of earrings, "necklace" if it is a necklace/choker/hasli/mangalsutra/chain, otherwise null`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5",
      max_tokens: 400,
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: photo.type, data: Buffer.from(photo.bytes).toString("base64") } },
            { type: "text", text: prompt },
          ],
        },
      ],
    }),
    signal: AbortSignal.timeout(40_000),
  });
  if (!res.ok) {
    console.warn("listing draft failed", res.status, await res.text().catch(() => ""));
    return null;
  }
  const data = await res.json();
  const text: string = data?.content?.find((c: { type: string }) => c.type === "text")?.text ?? "";
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) return null;
  try {
    const d = JSON.parse(json);
    return {
      name: String(d.name ?? "").slice(0, 80),
      description: String(d.description ?? "").slice(0, 500),
      tags: Array.isArray(d.tags) ? d.tags.map(String).slice(0, 4) : [],
      tryOn: d.tryOn === "earrings" || d.tryOn === "necklace" ? d.tryOn : null,
    };
  } catch {
    return null;
  }
}

export function pipelineStatus() {
  return { cutouts: Boolean(process.env.REMOVE_BG_API_KEY), aiText: Boolean(process.env.ANTHROPIC_API_KEY) };
}
