import { promises as fs } from "fs";
import path from "path";

/** Serves admin uploads in local mode (Supabase mode uses Supabase Storage URLs instead). */
const types: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-z0-9-]+\.(jpg|jpeg|png|webp)$/i.test(name)) return new Response("Not found", { status: 404 });
  try {
    const bytes = await fs.readFile(path.join(process.cwd(), ".data", "uploads", name));
    const ext = name.split(".").pop()!.toLowerCase();
    return new Response(bytes, { headers: { "content-type": types[ext], "cache-control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
