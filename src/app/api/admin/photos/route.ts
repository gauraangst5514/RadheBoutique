import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { removeBackground } from "@/lib/pipeline";
import type { ProductImage } from "@/lib/types";

export const maxDuration = 60;

/**
 * Upload ONE photo (the phone resizes it first). Returns the stored images:
 * the original photo, plus a cut-out if background removal is switched on.
 */
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Please log in again" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("photo");
  if (!(file instanceof File)) return NextResponse.json({ error: "No photo" }, { status: 400 });
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return NextResponse.json({ error: "Use a JPG, PNG or WebP photo" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Photo is too large" }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const images: ProductImage[] = [];
  images.push({ url: await db.saveImage({ name: file.name || "photo.jpg", type: file.type, bytes }), kind: "photo" });

  const cutout = await removeBackground(bytes, file.type).catch(() => null);
  if (cutout) images.unshift({ url: await db.saveImage({ name: "cutout.png", type: "image/png", bytes: cutout }), kind: "cutout" });

  return NextResponse.json({ images });
}
