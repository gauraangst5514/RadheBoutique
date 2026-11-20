"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroStage } from "./stage";
import { ArrowLeft, ArrowRight, ArrowRightSmall, SpinIcon } from "@/components/icons";

export interface HeroSlide {
  word: string;
  eyebrow: string;
  line: string;
  price: string;
  tag1: string;
  tag2: string;
  bg: string;
  ink: string;
  href: string;
  tryOnHref?: string | null;
  alt3d: string;
  real: { name: string; image?: string | null; href: string };
}

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [i, setI] = useState(0);
  const [failed, setFailed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HeroStage | null>(null);
  const first = useRef(i);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;
    import("./stage")
      .then(({ createHeroStage }) => {
        if (cancelled) return;
        try {
          stageRef.current = createHeroStage(canvas, first.current, { zBase: window.innerWidth < 768 ? 7.6 : 9 });
        } catch {
          setFailed(true);
        }
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
      stageRef.current?.dispose();
      stageRef.current = null;
    };
  }, []);

  useEffect(() => {
    stageRef.current?.show(i);
  }, [i]);

  const s = slides[i];
  const go = (k: number) => setI((k + slides.length) % slides.length);

  return (
    <section aria-roledescription="carousel" aria-label="Featured collections" className="px-3 md:px-4">
      <div
        className="relative mx-auto h-[600px] max-w-[1408px] overflow-hidden rounded-[28px] transition-colors duration-700 md:h-[660px] md:rounded-[32px]"
        style={{ background: s.bg, color: s.ink }}
      >
        {/* giant word behind the piece */}
        <div
          key={`w${i}`}
          aria-hidden
          className="anim-word font-display absolute inset-x-0 top-[26px] z-[1] whitespace-nowrap text-center leading-[.92] md:top-[70px]"
          style={{ fontSize: `clamp(${s.word.length > 8 ? 56 : 72}px, 15vw, 236px)` }}
        >
          {s.word}
        </div>

        {/* 3D stage */}
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${s.alt3d}. Drag to spin it.`}
          className="absolute inset-x-0 top-16 z-[2] h-[350px] w-full cursor-grab touch-pan-y active:cursor-grabbing md:inset-0 md:h-full"
        />
        {failed && s.real.image && (
          <div className="absolute left-1/2 top-[110px] z-[2] w-[220px] -translate-x-1/2 overflow-hidden arch border-[6px] md:top-[150px] md:w-[300px]" style={{ borderColor: s.ink }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.real.image} alt={s.real.name} className="aspect-[3/4] w-full object-cover" />
          </div>
        )}

        {/* UI layer */}
        <div key={`u${i}`} className="pointer-events-none absolute inset-0 z-[3] [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
          <div
            className="anim-floaty absolute left-3.5 top-[330px] rounded-full bg-pink px-4 py-2.5 text-[17px] font-bold text-white shadow-lg md:left-[calc(50%-330px)] md:top-[300px] md:px-5 md:py-3 md:text-xl"
            style={{ ["--r" as string]: "-6deg" }}
          >
            {s.price}
          </div>
          <div className="anim-floaty absolute right-3.5 top-[130px] rounded-full bg-paper px-3 py-2 text-xs font-bold tracking-wider text-ink md:left-[calc(50%+190px)] md:right-auto md:top-[236px] md:px-4 md:py-2.5 md:text-sm" style={{ ["--r" as string]: "5deg", animationDelay: "-1.3s" }}>
            {s.tag1}
          </div>
          <div className="anim-floaty absolute hidden rounded-full bg-paper px-4 py-2.5 text-sm font-bold tracking-wider text-ink md:left-[calc(50%+170px)] md:top-[470px] md:block" style={{ ["--r" as string]: "-3deg", animationDelay: "-2.4s" }}>
            {s.tag2}
          </div>

          {/* real piece card (desktop) */}
          <Link
            href={s.real.href}
            className="anim-hero-in absolute right-9 top-9 hidden w-[150px] flex-col gap-2 rounded-[22px] bg-paper p-2.5 pb-3 text-ink no-underline shadow-xl lg:flex"
          >
            <RealThumb src={s.real.image} alt={s.real.name} className="aspect-square w-full rounded-t-full rounded-b-xl" />
            <span className="text-[11px] font-bold tracking-[.12em] text-muted">THE REAL PIECE</span>
            <span className="text-sm font-bold leading-tight">{s.real.name}</span>
            <span className="flex items-center gap-1 text-[13px] font-bold text-pink">
              Shop now <ArrowRightSmall />
            </span>
          </Link>

          <div className="absolute bottom-[128px] left-1/2 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/35 bg-white/20 px-3.5 py-2 text-[13px] font-bold md:flex">
            <SpinIcon /> Drag to spin
          </div>

          {/* bottom bar */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3.5 px-[18px] pb-5 md:flex-row md:items-end md:justify-between md:px-10 md:pb-8">
            <div className="flex flex-col gap-3.5 md:max-w-[360px]">
              <div className="flex items-center justify-between gap-2.5">
                <span className="font-serif-italic text-[22px] md:text-[26px]">{s.eyebrow}</span>
                <span className="flex items-center gap-1.5 text-xs font-bold opacity-85 md:hidden">
                  <SpinIcon size={14} /> Drag
                </span>
              </div>
              <p className="hidden text-base leading-normal opacity-90 md:block">{s.line}</p>
              <div className="flex gap-2.5">
                <Link href={s.href} className="flex-1 rounded-full px-6 py-3.5 text-center text-[15px] font-bold no-underline md:flex-none" style={{ background: s.ink, color: s.bg }}>
                  Shop the drop
                </Link>
                {s.tryOnHref && (
                  <Link href={s.tryOnHref} className="flex-1 rounded-full border-2 px-5 py-3 text-center text-[15px] font-bold no-underline md:flex-none" style={{ borderColor: s.ink, color: s.ink }}>
                    Try it on
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3.5">
              <Link href={s.real.href} className="anim-hero-in flex min-h-11 items-center gap-2.5 rounded-full bg-paper py-1 pl-1 pr-3.5 text-ink no-underline lg:hidden">
                <RealThumb src={s.real.image} alt="" className="size-9 rounded-full" />
                <span className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold tracking-[.1em] text-muted">REAL PIECE</span>
                  <span className="text-[13px] font-bold">{s.real.name}</span>
                </span>
              </Link>
              <div className="flex items-center gap-2 md:gap-3.5">
                <span className="font-display hidden text-[22px] tracking-wider md:inline">
                  0{i + 1} / 0{slides.length}
                </span>
                <button aria-label="Previous collection" onClick={() => go(i - 1)} className="flex size-11 cursor-pointer items-center justify-center rounded-full border-2 bg-transparent md:size-[52px]" style={{ borderColor: s.ink, color: s.ink }}>
                  <ArrowLeft />
                </button>
                <button aria-label="Next collection" onClick={() => go(i + 1)} className="flex size-11 cursor-pointer items-center justify-center rounded-full border-0 md:size-[52px]" style={{ background: s.ink, color: s.bg }}>
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 pt-4">
        {slides.map((d, k) => (
          <button
            key={d.word}
            aria-label={`Show ${d.eyebrow}`}
            aria-current={k === i}
            onClick={() => go(k)}
            className="h-2.5 cursor-pointer rounded-full border-0 p-0 transition-all duration-300"
            style={{ width: k === i ? 34 : 10, background: k === i ? "#2A0A18" : "#D9B8C4" }}
          />
        ))}
      </div>
    </section>
  );
}

function RealThumb({ src, alt, className }: { src?: string | null; alt: string; className: string }) {
  if (!src) return <span aria-hidden className={`placeholder-stripes block ${className}`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`object-cover ${className}`} />;
}
