import { Bangle, Bow, Heart, Jhumka, Necklace, Ring } from "./Jewels";

/**
 * Page header used on shop and help pages: a big title on a blush band, with little jewellery
 * stickers floating around it and a gentle shimmer sweeping across.
 */
export function PageBanner({ title, eyebrow, line }: { title: string; eyebrow?: string; line?: string }) {
  const stickers = [
    { el: <Jhumka />, cls: "right-[6%] top-[14%] text-[38px] md:text-[54px]", r: "-8deg", d: "0s" },
    { el: <Ring />, cls: "right-[22%] bottom-[12%] text-[30px] md:text-[42px]", r: "10deg", d: "-1.2s" },
    { el: <Heart />, cls: "right-[36%] top-[10%] hidden text-[28px] md:block md:text-[36px]", r: "-6deg", d: "-2.1s" },
    { el: <Bow />, cls: "right-[14%] top-[52%] hidden text-[34px] md:block md:text-[44px]", r: "6deg", d: "-.6s" },
    { el: <Necklace />, cls: "right-[30%] bottom-[8%] hidden text-[34px] md:block", r: "-4deg", d: "-1.7s" },
    { el: <Bangle />, cls: "right-[2%] bottom-[10%] text-[26px] md:text-[34px]", r: "12deg", d: "-2.6s" },
  ];
  return (
    <div className="pb-shimmer relative overflow-hidden rounded-[24px] bg-blush px-5 py-7 text-maroon md:rounded-[30px] md:px-10 md:py-12">
      <div aria-hidden className="pointer-events-none absolute -left-20 -top-24 size-[300px] rounded-full bg-[#ff9cc0] opacity-50 blur-[90px]" />
      {stickers.map((s, k) => (
        <span key={k} aria-hidden className={`anim-floaty absolute ${s.cls}`} style={{ ["--r" as string]: s.r, animationDelay: s.d }}>
          {s.el}
        </span>
      ))}
      <span aria-hidden className="lady-twinkle absolute right-[44%] top-[20%] hidden text-xl text-gold md:block">✦</span>
      <span aria-hidden className="lady-twinkle absolute right-[10%] top-[6%] text-lg text-pink" style={{ animationDelay: "-1.3s" }}>✦</span>
      <div className="relative flex max-w-[62%] flex-col gap-2 md:max-w-[58%]">
        {eyebrow && <span className="kh-in font-serif-italic text-lg text-pink md:text-2xl">{eyebrow}</span>}
        <h1 className="kh-in font-display m-0 text-[44px] leading-[.92] md:text-[84px]" style={{ animationDelay: "80ms" }}>
          {title.toUpperCase()}
        </h1>
        {line && (
          <p className="kh-in m-0 text-sm leading-relaxed md:text-base" style={{ animationDelay: "160ms" }}>
            {line}
          </p>
        )}
      </div>
    </div>
  );
}
