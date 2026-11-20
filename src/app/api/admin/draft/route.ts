import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { categories, type CategorySlug } from "@/config/store";
import { draftListing } from "@/lib/pipeline";

export const maxDuration = 60;

/** AI draft of title/description/tags from one photo. Nothing is saved. */
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Please log in again" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("photo");
  if (!(file instanceof File) || !/^image\/(jpeg|png|webp)$/.test(file.type)) return NextResponse.json({ draft: null });
  const c = String(form.get("category") ?? "");
  const category = (categories.some((x) => x.slug === c) ? c : "anti-tarnish") as CategorySlug;
  const draft = await draftListing({ bytes: new Uint8Array(await file.arrayBuffer()), type: file.type }, category, Number(form.get("price") ?? 0) || 0).catch(() => null);
  return NextResponse.json({ draft });
}
