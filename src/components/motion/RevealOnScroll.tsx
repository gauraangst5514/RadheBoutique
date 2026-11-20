"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Fades and lifts anything marked `data-reveal` (and product cards) into view as you scroll.
 * Content stays visible if JavaScript is off or "reduce motion" is on: the hidden state only
 * applies once this script has added the `reveal-ready` class to <html>.
 */
export function RevealOnScroll() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const els = document.querySelectorAll("[data-reveal]:not(.is-in)");
    els.forEach((el) => {
      // Already on screen at load: show at once, no flash.
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      else io.observe(el);
    });
    return () => io.disconnect();
  }, [path]);
  return null;
}
