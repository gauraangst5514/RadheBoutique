import Link from "next/link";
import { Jhumka } from "@/components/motion/Jewels";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-5 pt-12 text-center">
      <div aria-hidden className="relative flex h-[170px] items-start justify-center gap-6">
        {[{ h: 60, d: "0s" }, { h: 96, d: "-.7s" }, { h: 40, d: "-1.4s" }].map((j, k) => (
          <span key={k} className="foot-jhumka flex flex-col items-center" style={{ animationDelay: j.d, transformOrigin: "50% 0" }}>
            <span className="block w-[2px] bg-gold" style={{ height: j.h }} />
            <span className="text-[44px] leading-none">
              <Jhumka />
            </span>
          </span>
        ))}
      </div>
      <h1 className="font-display m-0 text-[56px] leading-none md:text-[80px]">OOPS!</h1>
      <p className="m-0 max-w-[420px] text-muted">Ye piece nahi mila. It may have sold out, or the link is old.</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        <Link href="/shop/korean-earrings" className="rounded-full bg-pink px-6 py-3.5 font-bold text-white no-underline">See what&apos;s in stock</Link>
        <Link href="/" className="rounded-full border-2 border-ink px-6 py-3 font-bold text-ink no-underline">Home</Link>
      </div>
    </div>
  );
}
