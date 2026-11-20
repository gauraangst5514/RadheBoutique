"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { categories, type CategorySlug } from "@/config/store";
import type { ProductImage } from "@/lib/types";
import { CameraIcon, TrashIcon } from "@/components/icons";

interface Photo {
  key: string;
  preview: string;
  blob: Blob;
  status: "uploading" | "done" | "error";
  images: ProductImage[];
}
interface VariantRow {
  name: string;
  swatch: string;
  stock: number;
}
interface Draft {
  name: string;
  description: string;
  tags: string;
  tryOn: "" | "earrings" | "necklace";
}

const SWATCHES = ["#B3123A", "#0E7A4F", "#F2A7C3", "#E8B45A", "#F4F1EC", "#1F3A93", "#2A0A18"];
const TITLES = ["Photos and price", "Colours and online stock", "Preparing your listing", "Check and publish"];

/** Shrinks phone photos to ≤1600px JPEG before upload (keeps uploads fast and under host limits). */
async function shrink(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob((b) => res(b ?? file), "image/jpeg", 0.86));
  } catch {
    return file;
  }
}

export function AddProductFlow({ pipeline }: { pipeline: { cutouts: boolean; aiText: boolean } }) {
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [category, setCategory] = useState<CategorySlug>("anti-tarnish");
  const [variants, setVariants] = useState<VariantRow[]>([{ name: "Gold", swatch: "#E8B45A", stock: 1 }]);
  const [draft, setDraft] = useState<Draft>({ name: "", description: "", tags: "", tryOn: "" });
  const [drafting, setDrafting] = useState<"idle" | "busy" | "done" | "off">("idle");
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<{ slug: string; name: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploading = photos.some((p) => p.status === "uploading");
  const total = variants.reduce((s, v) => s + v.stock, 0);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    const list = Array.from(files).slice(0, 6 - photos.length);
    for (const f of list) {
      const blob = await shrink(f);
      const key = Math.random().toString(36).slice(2);
      const photo: Photo = { key, preview: URL.createObjectURL(blob), blob, status: "uploading", images: [] };
      setPhotos((ps) => [...ps, photo]);
      const fd = new FormData();
      fd.append("photo", new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" }));
      fetch("/api/admin/photos", { method: "POST", body: fd })
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          setPhotos((ps) => ps.map((p) => (p.key === key ? { ...p, status: "done", images: d.images } : p)));
        })
        .catch(() => setPhotos((ps) => ps.map((p) => (p.key === key ? { ...p, status: "error" } : p))));
    }
  }

  async function runDraft() {
    if (!pipeline.aiText || !photos[0]) {
      setDrafting("off");
      return;
    }
    setDrafting("busy");
    const fd = new FormData();
    fd.append("photo", new File([photos[0].blob], "photo.jpg", { type: photos[0].blob.type || "image/jpeg" }));
    fd.append("category", category);
    fd.append("price", price);
    try {
      const r = await fetch("/api/admin/draft", { method: "POST", body: fd });
      const d = await r.json();
      if (d.draft) {
        setDraft((cur) => ({
          name: cur.name || d.draft.name,
          description: cur.description || d.draft.description,
          tags: cur.tags || (d.draft.tags ?? []).join(", "),
          tryOn: cur.tryOn || d.draft.tryOn || "",
        }));
      }
    } catch {}
    setDrafting("done");
  }

  function next() {
    setError(null);
    if (step === 0) {
      if (!photos.length) return setError("Add at least one photo.");
      if (!Number(price)) return setError("Enter the offer price.");
      return setStep(1);
    }
    if (step === 1) {
      if (variants.some((v) => !v.name.trim())) return setError("Give every colour or size a name.");
      setStep(2);
      if (drafting === "idle") runDraft();
      return;
    }
    if (step === 2) return setStep(3);
  }

  async function publish() {
    setError(null);
    if (!draft.name.trim()) return setError("Add a product name.");
    if (uploading) return setError("Photos are still uploading.");
    const images = photos.filter((p) => p.status === "done").flatMap((p) => p.images);
    // Put the first cut-out first so the shop grid shows the studio shot.
    images.sort((a, b) => (a.kind === "cutout" ? -1 : 0) - (b.kind === "cutout" ? -1 : 0));
    // Live try-on needs a transparent cut-out. For earrings the FIRST photo should show one earring.
    const tryOnImage = draft.tryOn ? photos[0]?.images.find((i) => i.kind === "cutout")?.url ?? null : null;
    setBusy(true);
    const r = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: draft.name.trim(),
        category,
        price: Number(price),
        mrp: mrp ? Number(mrp) : null,
        description: draft.description.trim(),
        tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 5),
        images,
        variants: variants.map((v) => ({ name: v.name.trim(), swatch: category === "kurtis" ? null : v.swatch, stock: v.stock })),
        tryOn: draft.tryOn || null,
        tryOnImage,
        featured,
      }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) return setError(d.error ?? "Couldn't publish. Try again.");
    setCreated({ slug: d.product.slug, name: d.product.name });
  }

  const input = "min-h-12 w-full rounded-xl border border-[#D9B8C4] bg-white px-3.5 text-base";

  if (created) {
    return (
      <div className="flex flex-col gap-4 pt-6">
        <div className="rounded-2xl bg-emerald p-5 text-[#FFF1DC]">
          <p className="m-0 text-lg font-bold">{created.name} is live</p>
          <p className="m-0 mt-1 text-sm">Customers can buy it now. Online stock drops with each order.</p>
        </div>
        <Link href={`/p/${created.slug}`} className="font-bold">See it on the website</Link>
        <button onClick={() => location.reload()} className="min-h-[54px] cursor-pointer rounded-full border-0 bg-pink text-base font-bold text-white">
          Add another product
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[480px] flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h1 className="font-display m-0 text-[30px] leading-none">ADD PRODUCT</h1>
          <span className="text-sm font-bold text-muted">Step {step + 1} of 4</span>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className={`h-1.5 flex-1 rounded-full ${k <= step ? "bg-pink" : "bg-line"}`} />
          ))}
        </div>
        <h2 className="m-0 text-lg font-bold">{TITLES[step]}</h2>
      </div>

      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-[15px] font-bold">Photos</span>
            <span className="text-sm text-muted">Any background is fine. Front, side and one on your hand works best.</span>
            {(category === "earrings" || category === "necklace-sets" || category === "hasli" || category === "anti-tarnish") && pipeline.cutouts && (
              <span className="rounded-xl bg-blush px-3 py-2 text-sm font-bold text-maroon">
                For live try-on, make the first photo {category === "earrings" ? "ONE earring" : "the whole necklace"}, front-on, laid flat on a plain background.
              </span>
            )}
            <div className="grid grid-cols-4 gap-2">
              {photos.map((p) => (
                <div key={p.key} className="relative aspect-square overflow-hidden rounded-xl bg-[#F3E7DF]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.preview} alt="" className="size-full object-cover" />
                  {p.status !== "done" && (
                    <span className={`absolute inset-x-0 bottom-0 py-0.5 text-center text-[10px] font-bold text-white ${p.status === "error" ? "bg-bad" : "bg-black/50"}`}>
                      {p.status === "error" ? "Failed" : "Uploading"}
                    </span>
                  )}
                  <button aria-label="Remove photo" onClick={() => setPhotos((ps) => ps.filter((x) => x.key !== p.key))} className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full border-0 bg-white/90 text-ink">
                    <TrashIcon size={14} />
                  </button>
                </div>
              ))}
              {photos.length < 6 && (
                <button onClick={() => fileRef.current?.click()} className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#C9A3B2] bg-paper text-[11px] font-bold text-[#8A4A62]">
                  <CameraIcon /> Add
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5"><span className="text-[15px] font-bold">Offer price (₹)</span><input inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} className={`${input} text-[17px] font-bold`} /></label>
            <label className="flex flex-col gap-1.5"><span className="text-[15px] font-bold">MRP (optional)</span><input inputMode="numeric" value={mrp} onChange={(e) => setMrp(e.target.value.replace(/\D/g, ""))} className={`${input} text-[17px]`} /></label>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[15px] font-bold">Category</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  aria-pressed={category === c.slug}
                  onClick={() => {
                    setCategory(c.slug);
                    if (c.slug === "kurtis" && variants.length === 1 && variants[0].name === "Gold") setVariants([{ name: "M", swatch: "", stock: 1 }, { name: "L", swatch: "", stock: 1 }]);
                  }}
                  className={`min-h-10 cursor-pointer rounded-full px-3.5 text-[13px] font-bold ${category === c.slug ? "border-2 border-ink bg-ink text-cream" : "border border-[#D9B8C4] bg-paper text-ink"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <p className="m-0 text-sm text-muted">
            {pipeline.aiText ? "No need to type a name or description: AI drafts them from the photo, and you check them before publishing." : "You'll type the name and description at the end."}
          </p>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-3">
          <span className="text-sm text-muted">Online stock only. Shop counter stock stays in your billing software.</span>
          {variants.map((v, k) => (
            <div key={k} className="flex flex-col gap-2 rounded-2xl border border-line bg-paper p-3">
              <div className="flex items-center gap-2">
                <input aria-label="Colour or size name" value={v.name} onChange={(e) => setVariants(variants.map((x, i) => (i === k ? { ...x, name: e.target.value } : x)))} className={`${input} flex-1 font-bold`} placeholder={category === "kurtis" ? "Size, e.g. M" : "Colour, e.g. Green"} />
                {variants.length > 1 && (
                  <button aria-label="Remove this option" onClick={() => setVariants(variants.filter((_, i) => i !== k))} className="flex size-11 items-center justify-center rounded-full border-0 bg-transparent text-muted">
                    <TrashIcon />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                {category !== "kurtis" ? (
                  <div className="flex gap-1.5" role="group" aria-label="Colour dot">
                    {SWATCHES.map((s) => (
                      <button key={s} aria-label={`Colour ${s}`} aria-pressed={v.swatch === s} onClick={() => setVariants(variants.map((x, i) => (i === k ? { ...x, swatch: s } : x)))} className={`size-8 rounded-full ${v.swatch === s ? "ring-2 ring-ink ring-offset-2" : ""}`} style={{ background: s, border: "1px solid rgba(0,0,0,.2)" }} />
                    ))}
                  </div>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-1.5">
                  <button aria-label="One less" onClick={() => setVariants(variants.map((x, i) => (i === k ? { ...x, stock: Math.max(0, x.stock - 1) } : x)))} className="size-11 cursor-pointer rounded-full border border-[#D9B8C4] bg-white text-xl font-bold">−</button>
                  <span className="w-8 text-center text-lg font-bold">{v.stock}</span>
                  <button aria-label="One more" onClick={() => setVariants(variants.map((x, i) => (i === k ? { ...x, stock: x.stock + 1 } : x)))} className="size-11 cursor-pointer rounded-full border-0 bg-ink text-xl font-bold text-white">+</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setVariants([...variants, { name: "", swatch: SWATCHES[variants.length % SWATCHES.length], stock: 1 }])} className="min-h-12 cursor-pointer rounded-2xl border-2 border-dashed border-[#C9A3B2] bg-transparent font-bold text-maroon">
            + Add {category === "kurtis" ? "size" : "colour"}
          </button>
          <div className="flex justify-between pt-1"><span>Total online stock</span><strong>{total} pieces</strong></div>
        </div>
      )}

      {step === 2 && (
        <ul className="m-0 flex list-none flex-col p-0">
          <Check label="Photos uploaded" state={uploading ? "busy" : photos.some((p) => p.status === "error") ? "warn" : "done"} note={photos.some((p) => p.status === "error") ? "Some failed. Go back to remove them." : undefined} />
          <Check label="Background removed (studio shot)" state={pipeline.cutouts ? (uploading ? "busy" : "done") : "off"} note={pipeline.cutouts ? undefined : "Off. Add a remove.bg key to switch it on."} />
          <Check label="Title and Hinglish description" state={drafting === "busy" ? "busy" : drafting === "done" ? "done" : "off"} note={pipeline.aiText ? undefined : "Off. Add an Anthropic API key to switch it on."} />
          <Check
            label="Live try-on image"
            state={!pipeline.cutouts ? "off" : uploading ? "busy" : photos[0]?.images.some((i) => i.kind === "cutout") ? "done" : "warn"}
            note={!pipeline.cutouts ? "Off. Needs background removal (remove.bg key)." : "Made from the first photo's cut-out. Pick Earrings or Necklace as the try-on type next."}
          />
          <li className="pt-3 text-sm text-muted">The jewellery itself is never redrawn. Only the background is removed.</li>
        </ul>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5"><span className="text-sm font-bold">Product name{drafting === "done" && " (AI draft)"}</span><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={`${input} font-bold`} /></label>
          <label className="flex flex-col gap-1.5"><span className="text-sm font-bold">Description</span><textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={`${input} py-2.5 leading-snug`} /></label>
          <label className="flex flex-col gap-1.5"><span className="text-sm font-bold">Tags (comma separated)</span><input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} className={input} placeholder="Kundan, Festive" /></label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold">Try-on type</span>
            <select value={draft.tryOn} onChange={(e) => setDraft({ ...draft, tryOn: e.target.value as Draft["tryOn"] })} className={input}>
              <option value="">None</option>
              <option value="earrings">Earrings</option>
              <option value="necklace">Necklace</option>
            </select>
          </label>
          <label className="flex min-h-12 items-center gap-3 font-bold"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="size-5 accent-pink" /> Feature on homepage</label>
          <p className="m-0 text-sm text-muted">₹{price} · {total} in online stock · {photos.length} photo{photos.length === 1 ? "" : "s"}</p>
        </div>
      )}

      {error && <p role="alert" className="m-0 rounded-xl bg-[#FBE4E7] p-3 font-bold text-bad">{error}</p>}

      <div className="sticky bottom-0 -mx-4 flex gap-2.5 border-t border-line bg-cream px-4 py-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="min-h-[52px] flex-1 cursor-pointer rounded-full border-2 border-ink bg-transparent text-base font-bold">Back</button>
        )}
        {step < 3 ? (
          <button onClick={next} disabled={step === 2 && (uploading || drafting === "busy")} className="min-h-[52px] flex-[2] cursor-pointer rounded-full border-0 bg-pink text-base font-bold text-white disabled:opacity-60">
            {step === 2 ? (uploading || drafting === "busy" ? "Preparing…" : "Looks good") : "Next"}
          </button>
        ) : (
          <button onClick={publish} disabled={busy} className="min-h-[52px] flex-[2] cursor-pointer rounded-full border-0 bg-emerald text-base font-bold text-white disabled:opacity-60">
            {busy ? "Publishing…" : "Publish"}
          </button>
        )}
      </div>
    </div>
  );
}

function Check({ label, state, note }: { label: string; state: "done" | "busy" | "off" | "warn"; note?: string }) {
  const dot = { done: "bg-ok", busy: "bg-warn", off: "bg-[#8C7380]", warn: "bg-bad" }[state];
  const mark = { done: "✓", busy: "…", off: "–", warn: "!" }[state];
  return (
    <li className="flex items-start gap-3 border-b border-[#F0DDE4] py-3">
      <span aria-hidden className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ${dot}`}>{mark}</span>
      <span className="flex flex-col">
        <span className="text-[15px]">{label}</span>
        {note && <span className="text-xs text-muted">{note}</span>}
      </span>
    </li>
  );
}
