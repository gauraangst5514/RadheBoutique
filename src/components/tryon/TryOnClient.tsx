"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import type { Product } from "@/lib/types";
import { rupees } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { pickImage } from "@/components/ProductImg";
import { CloseIcon } from "@/components/icons";
import { OverlayState, coverMap, drawFrame, loadFaceTracker, type TryOnKind } from "./engine";

type Phase = "intro" | "starting" | "live" | "denied" | "nocamera" | "error";

export interface TryOnOption {
  variantId: string;
  name: string;
  swatch?: string | null;
  image: string;
  stock: number;
}

export function TryOnClient({ product, kind, options, initialVariant }: { product: Product; kind: TryOnKind; options: TryOnOption[]; initialVariant?: string }) {
  const add = useCart((s) => s.add);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef(0);
  const state = useRef(new OverlayState());

  const [phase, setPhase] = useState<Phase>("intro");
  const [face, setFace] = useState(true);
  const [sel, setSel] = useState(Math.max(0, options.findIndex((o) => o.variantId === initialVariant)));
  const [added, setAdded] = useState(false);
  const [shot, setShot] = useState<string | null>(null);

  const opt = options[sel];
  const isLookalike = opt.image.startsWith("/tryon/");

  // Load the selected piece's image.
  useEffect(() => {
    const img = new Image();
    img.src = opt.image;
    img.onload = () => (imgRef.current = img);
  }, [opt.image]);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => {
    stop();
    trackerRef.current?.close();
  }, [stop]);

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia) return setPhase("nocamera");
    setPhase("starting");
    try {
      const [stream, tracker] = await Promise.all([
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }),
        trackerRef.current ? Promise.resolve(trackerRef.current) : loadFaceTracker(),
      ]);
      trackerRef.current = tracker;
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setPhase("live");
      loop();
    } catch (e) {
      const name = (e as DOMException)?.name;
      stop();
      setPhase(name === "NotAllowedError" || name === "SecurityError" ? "denied" : name === "NotFoundError" ? "nocamera" : "error");
    }
  }

  function loop() {
    let lastVideoTime = -1;
    let last = performance.now();
    let missing = 0;
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const video = videoRef.current, canvas = canvasRef.current, tracker = trackerRef.current, img = imgRef.current;
      if (!video || !canvas || !tracker || !img || video.readyState < 2) return;
      if (video.currentTime === lastVideoTime) return;
      lastVideoTime = video.currentTime;
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;

      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(cw * dpr)) {
        canvas.width = Math.round(cw * dpr);
        canvas.height = Math.round(ch * dpr);
      }
      const ctx = canvas.getContext("2d")!;
      const res = tracker.detectForVideo(video, now);
      const map = coverMap(video.videoWidth, video.videoHeight, canvas.width, canvas.height);
      const seen = drawFrame(ctx, res.faceLandmarks?.[0], map, state.current, dt, { kind, img });
      missing = seen ? 0 : missing + 1;
      if (missing === 0 || missing === 20) setFace(seen);
    };
    tick();
  }

  async function capture() {
    const video = videoRef.current, overlay = canvasRef.current;
    if (!video || !overlay) return;
    const c = document.createElement("canvas");
    c.width = overlay.width;
    c.height = overlay.height;
    const ctx = c.getContext("2d")!;
    // Mirror like the screen, so the photo looks like what the shopper saw.
    ctx.translate(c.width, 0);
    ctx.scale(-1, 1);
    const s = Math.max(c.width / video.videoWidth, c.height / video.videoHeight);
    ctx.drawImage(video, (c.width - video.videoWidth * s) / 2, (c.height - video.videoHeight * s) / 2, video.videoWidth * s, video.videoHeight * s);
    ctx.drawImage(overlay, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const fs = Math.round(c.width / 30);
    const band = fs * 3.2;
    ctx.fillStyle = "rgba(42,10,24,.78)";
    ctx.fillRect(0, c.height - band, c.width, band);
    ctx.fillStyle = "#FFF7F2";
    ctx.font = `bold ${fs}px sans-serif`;
    let title = `${product.name} · ${rupees(product.price)}`;
    while (ctx.measureText(title).width > c.width - fs * 2 && title.length > 8) title = title.slice(0, -2);
    ctx.fillText(title, fs, c.height - band + fs * 1.35);
    ctx.font = `${Math.round(fs * 0.8)}px sans-serif`;
    ctx.fillText("Radhe Boutique, Nashik", fs, c.height - band + fs * 2.55);
    setShot(c.toDataURL("image/jpeg", 0.9));
  }

  async function shareShot() {
    if (!shot) return;
    const blob = await (await fetch(shot)).blob();
    const file = new File([blob], `radhe-tryon-${product.slug}.jpg`, { type: "image/jpeg" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], title: product.name }).catch(() => {});
    } else {
      const a = document.createElement("a");
      a.href = shot;
      a.download = file.name;
      a.click();
    }
  }

  function addToCart() {
    const v = product.variants.find((x) => x.id === opt.variantId);
    if (!v || v.stock <= 0) return;
    add({
      productId: product.id,
      variantId: v.id,
      slug: product.slug,
      name: product.name,
      variantName: v.name,
      category: product.category,
      unitPrice: product.price,
      image: pickImage(product)?.url ?? null,
      maxQty: v.stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const inStock = opt.stock > 0;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#1A1114] text-[#FFF1DC]">
      {/* camera */}
      <div className="relative flex-1">
        <video ref={videoRef} playsInline muted className="absolute inset-0 size-full -scale-x-100 object-cover" />
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 size-full -scale-x-100" aria-hidden />

        {phase !== "live" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="arch flex h-[200px] w-[150px] items-center justify-center border-2 border-gold bg-[#4A0A1A]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={opt.image} alt="" className="max-h-[70%] max-w-[70%] object-contain" />
            </div>
            {phase === "intro" && (
              <>
                <h1 className="font-display m-0 text-[40px] leading-none">PEHNO, PHIR LO</h1>
                <p className="m-0 max-w-[320px] text-[15px] leading-relaxed text-[#F3DCC0]">
                  {kind === "earrings" ? "Face the camera with your ears showing. Tie your hair back if you can." : "Hold the phone a little away so your neck shows."}{" "}
                  Your camera stays on your phone. Nothing is recorded or uploaded.
                </p>
                <button onClick={start} className="min-h-[54px] cursor-pointer rounded-full border-0 bg-gold px-8 text-base font-bold text-[#3B0614]">
                  Start camera
                </button>
              </>
            )}
            {phase === "starting" && <p className="m-0 text-base font-bold">Opening camera…</p>}
            {phase === "denied" && (
              <p className="m-0 max-w-[320px] text-[15px] leading-relaxed">
                Camera access was blocked. Allow the camera for this site in your browser settings, then <button onClick={start} className="cursor-pointer border-0 bg-transparent p-0 font-bold text-gold underline">try again</button>.
              </p>
            )}
            {phase === "nocamera" && <p className="m-0 max-w-[320px] text-[15px]">We couldn&apos;t find a camera on this device. Try on your phone instead.</p>}
            {phase === "error" && (
              <p className="m-0 max-w-[320px] text-[15px]">
                Try-on couldn&apos;t start on this browser. <button onClick={start} className="cursor-pointer border-0 bg-transparent p-0 font-bold text-gold underline">Try again</button>
              </p>
            )}
          </div>
        )}

        {phase === "live" && !face && (
          <div className="absolute inset-x-0 top-24 flex justify-center">
            <span className="rounded-full bg-black/60 px-4 py-2 text-sm font-bold">
              {kind === "earrings" ? "Look at the camera so we can find your ears" : "Move back a little so your neck shows"}
            </span>
          </div>
        )}

        {/* top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3.5">
          <Link href={`/p/${product.slug}`} aria-label="Close try-on" className="flex size-11 items-center justify-center rounded-full bg-black/45 text-[#FFF1DC]">
            <CloseIcon />
          </Link>
          <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            Camera stays on your phone
          </span>
          <span className="size-11" />
        </div>
        {isLookalike && phase === "live" && (
          <span className="absolute left-1/2 top-[68px] -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[11px]">Preview uses a 3D look-alike</span>
        )}

        {phase === "live" && (
          <button onClick={capture} aria-label="Save a photo of this look" className="absolute bottom-5 left-1/2 size-[68px] -translate-x-1/2 cursor-pointer rounded-full border-4 border-[#FFF1DC] bg-white/20" />
        )}
      </div>

      {/* bottom sheet */}
      <div className="flex flex-col gap-3.5 rounded-t-[28px] bg-cream px-4 pb-5 pt-4 text-ink">
        {options.length > 1 && (
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto">
            {options.map((o, k) => (
              <button
                key={o.variantId}
                onClick={() => setSel(k)}
                aria-pressed={k === sel}
                className={`flex h-[72px] min-w-[78px] shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl bg-paper ${k === sel ? "border-[3px] border-pink" : "border border-[#D9B8C4]"}`}
              >
                <span aria-hidden className="size-6 rounded-full border-[3px] border-gold" style={{ background: o.swatch ?? "#E8B45A" }} />
                <span className="text-xs font-bold">{o.name}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight">{product.name}{options.length > 1 ? ` · ${opt.name}` : ""}</span>
            <span className="text-base font-bold text-pink">{rupees(product.price)}</span>
          </div>
          {inStock ? (
            <button onClick={addToCart} className="min-h-[50px] shrink-0 cursor-pointer rounded-full border-0 bg-pink px-5 text-[15px] font-bold text-white">
              {added ? "Added" : "Add to cart"}
            </button>
          ) : (
            <Link href={`/p/${product.slug}`} className="shrink-0 rounded-full bg-maroon px-5 py-3.5 text-[15px] font-bold text-white no-underline">Sold out · notify me</Link>
          )}
        </div>
        {added && <Link href="/cart" className="text-sm font-bold">Go to cart</Link>}
      </div>

      {/* captured photo */}
      {shot && (
        <div className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/85 p-5" role="dialog" aria-label="Your try-on photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot} alt="Your try-on photo" className="max-h-[70vh] max-w-full rounded-2xl" />
          <div className="flex gap-3">
            <button onClick={shareShot} className="min-h-[50px] cursor-pointer rounded-full border-0 bg-gold px-6 font-bold text-[#3B0614]">Share or save</button>
            <button onClick={() => setShot(null)} className="min-h-[50px] cursor-pointer rounded-full border-2 border-[#FFF1DC] bg-transparent px-6 font-bold text-[#FFF1DC]">Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
