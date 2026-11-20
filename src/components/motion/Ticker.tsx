/** A tilted band of scrolling text, used between homepage sections. */
export function Ticker({ items, tone = "maroon", tilt = -1.2 }: { items: string[]; tone?: "maroon" | "pink" | "gold"; tilt?: number }) {
  const bg = { maroon: "bg-maroon text-blush", pink: "bg-pink text-white", gold: "bg-gold text-maroon" }[tone];
  const star = tone === "gold" ? "text-pink" : "text-gold";
  const row = [...items, ...items, ...items, ...items];
  return (
    <div aria-hidden className="my-6 overflow-hidden py-3 md:my-10">
    <div className={`relative -mx-[2%] w-[104%] overflow-hidden py-3 md:py-4 ${bg}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <div className="kh-track kh-left flex w-max gap-8 whitespace-nowrap" style={{ animationDuration: "34s" }}>
        {row.map((t, k) => (
          <span key={k} className="font-display text-[22px] tracking-wider md:text-[30px]">
            {t} <span className={star}>✦</span>
          </span>
        ))}
      </div>
    </div>
    </div>
  );
}
