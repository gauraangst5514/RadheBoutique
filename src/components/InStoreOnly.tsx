import { store } from "@/config/store";

/**
 * Shown on a category page that has nothing online right now (everything except Korean Earrings,
 * while that launch is on). It sends people to the shop or to Instagram for the latest stock.
 * All the motion is CSS (see "In-store only" in globals.css) and stops when "reduce motion" is on.
 */
export function InStoreOnly({ name }: { name: string }) {
  const wa = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(`Hi! What's in stock in ${name} right now?`)}`;
  const ticker = ["LATEST STOCK ON INSTAGRAM", "ROONGTHA SSRF MALL, NASHIK", "NEW PIECES EVERY WEEK", "ASK US ON WHATSAPP"];

  return (
    <section aria-label={`${name}: in the shop`} className="mt-6">
      <div className="relative overflow-hidden rounded-[28px] bg-blush text-maroon md:rounded-[32px]">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-[380px] rounded-full bg-[#ff9cc0] opacity-50 blur-[100px]" />

        <div className="relative flex flex-col gap-8 p-6 pb-24 md:flex-row md:items-center md:gap-6 md:p-12 md:pb-28">
          {/* copy */}
          <div className="flex flex-col gap-4 md:w-[52%] md:gap-5">
            <span className="kh-in flex items-center gap-2 self-start rounded-full bg-maroon px-3.5 py-1.5 text-[11px] font-bold tracking-[.18em] text-blush md:text-xs">
              <span className="kh-dot size-2 rounded-full bg-gold" /> IN THE SHOP RIGHT NOW
            </span>
            <h2 className="font-display kh-in m-0 text-[52px] leading-[.88] md:text-[96px]" style={{ animationDelay: "80ms" }}>
              YE SAB
              <br />
              <span className="kh-outline">SHOP PE</span> MILEGA
            </h2>
            <p className="kh-in m-0 max-w-[440px] text-[15px] leading-relaxed md:text-lg" style={{ animationDelay: "160ms" }}>
              Our {name.toLowerCase()} sell out fast and change every week, so we keep them in the shop for now. Drop by the
              shop, or check Instagram for today&apos;s stock.
            </p>
            <div className="kh-in flex flex-wrap gap-2.5" style={{ animationDelay: "240ms" }}>
              <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-maroon px-6 py-3.5 text-[15px] font-bold text-blush no-underline md:text-base">
                See today&apos;s stock
              </a>
              <a href={store.mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-maroon px-5 py-3 text-[15px] font-bold text-maroon no-underline md:text-base">
                Directions
              </a>
              <a href={wa} className="rounded-full px-3 py-3 text-[15px] font-bold text-maroon underline decoration-2 underline-offset-4 md:text-base">
                Ask on WhatsApp
              </a>
            </div>
            <p className="kh-in m-0 text-sm font-bold opacity-80" style={{ animationDelay: "320ms" }}>
              📍 {store.address}
            </p>
          </div>

          {/* motion graphic: a little shop with pieces popping out of the door, and a phone showing a reel */}
          <div aria-hidden className="relative mx-auto h-[300px] w-full max-w-[420px] md:h-[380px] md:flex-1">
            {/* shop */}
            <svg viewBox="0 0 260 240" className="absolute bottom-0 left-0 w-[72%]">
              <rect x="22" y="70" width="216" height="160" rx="10" fill="#FFFDF9" stroke="#6B1026" strokeWidth="4" />
              <g className="iso-awning">
                {[0, 1, 2, 3, 4, 5].map((k) => (
                  <path key={k} d={`M${12 + k * 39.3} 58 h39.3 v22 a19.65 19.65 0 0 1 -39.3 0 z`} fill={k % 2 ? "#FFFDF9" : "#C81E63"} stroke="#6B1026" strokeWidth="4" strokeLinejoin="round" />
                ))}
                <rect x="8" y="44" width="244" height="18" rx="6" fill="#6B1026" />
                <text x="130" y="58.5" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="13" fill="#F6C9D6" letterSpacing="4">RADHE BOUTIQUE</text>
              </g>
              <rect x="40" y="126" width="74" height="60" rx="8" fill="#F6C9D6" stroke="#6B1026" strokeWidth="4" />
              <path d="M52 170 q12 -26 24 0 M84 170 q12 -26 24 0" stroke="#E9B949" strokeWidth="4" fill="none" strokeLinecap="round" />
              <rect x="146" y="118" width="70" height="112" rx="8" fill="#6B1026" />
              <circle cx="202" cy="176" r="5" fill="#E9B949" />
              <g className="iso-sign">
                <rect x="160" y="132" width="42" height="22" rx="4" fill="#E9B949" />
                <text x="181" y="147" textAnchor="middle" fontSize="10" fontWeight="700" fill="#6B1026">OPEN</text>
              </g>
            </svg>

            {/* pieces popping out of the door */}
            <span className="iso-pop absolute bottom-[34%] left-[44%] text-[30px] md:text-[36px]" style={{ animationDelay: "0s" }}>
              <Jhumka />
            </span>
            <span className="iso-pop absolute bottom-[34%] left-[44%] text-[30px] md:text-[36px]" style={{ animationDelay: "-1.1s", ["--dx" as string]: "-70px" }}>
              <Ring />
            </span>
            <span className="iso-pop absolute bottom-[34%] left-[44%] text-[30px] md:text-[36px]" style={{ animationDelay: "-2.2s", ["--dx" as string]: "40px" }}>
              <Necklace />
            </span>
            <span className="iso-pop absolute bottom-[34%] left-[44%] text-[30px] md:text-[36px]" style={{ animationDelay: "-3.3s", ["--dx" as string]: "-20px" }}>
              <Heart />
            </span>

            {/* phone with a reel */}
            <div className="anim-floaty absolute right-0 top-2 w-[118px] rounded-[22px] border-4 border-maroon bg-maroon p-1.5 shadow-[0_24px_40px_-18px_rgba(107,16,38,.6)] md:w-[140px]" style={{ ["--r" as string]: "8deg" }}>
              <div className="relative aspect-[9/16] overflow-hidden rounded-[15px] bg-gradient-to-b from-[#ff9cc0] to-saffron">
                <span className="iso-reel absolute inset-x-2 top-3 h-2 rounded-full bg-white/60" />
                <span className="absolute left-1/2 top-[38%] -translate-x-1/2 text-[38px]">
                  <Jhumka />
                </span>
                <span className="absolute inset-x-2 bottom-8 rounded-md bg-pink px-1.5 py-1 text-center text-[10px] font-bold leading-tight text-white">NEW STOCK ✨</span>
                <span className="iso-heart absolute bottom-2 right-2 text-[16px] text-white">♥</span>
              </div>
            </div>

            {/* sparkles */}
            {[
              ["8%", "6%", "0s"],
              ["58%", "2%", "-.7s"],
              ["92%", "62%", "-1.4s"],
              ["34%", "20%", "-2.1s"],
            ].map(([l, t, d], k) => (
              <span key={k} className="iso-twinkle absolute text-[20px] text-gold" style={{ left: l, top: t, animationDelay: d }}>
                ✦
              </span>
            ))}
          </div>
        </div>

        {/* ticker */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 -rotate-[1.5deg] overflow-hidden bg-maroon py-3 text-blush">
          <div className="kh-track kh-left flex w-max gap-8 whitespace-nowrap" style={{ animationDuration: "28s" }}>
            {[...ticker, ...ticker, ...ticker, ...ticker].map((t, k) => (
              <span key={k} className="font-display text-[20px] tracking-wider md:text-[24px]">
                {t} <span className="text-gold">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const Jhumka = () => (
  <svg width="1em" height="1.3em" viewBox="0 0 40 52">
    <circle cx="20" cy="6" r="5" fill="#E9B949" stroke="#6B1026" strokeWidth="2" />
    <path d="M6 30 a14 14 0 0 1 28 0 z" fill="#E9B949" stroke="#6B1026" strokeWidth="2.5" />
    <path d="M20 11 v6" stroke="#6B1026" strokeWidth="2.5" />
    {[8, 14, 20, 26, 32].map((x) => (
      <circle key={x} cx={x} cy={36 + (x === 20 ? 4 : 0)} r="2.6" fill="#C81E63" stroke="#6B1026" strokeWidth="1.5" />
    ))}
  </svg>
);
const Ring = () => (
  <svg width="1em" height="1em" viewBox="0 0 40 40">
    <circle cx="20" cy="24" r="12" fill="none" stroke="#E9B949" strokeWidth="5" />
    <circle cx="20" cy="24" r="12" fill="none" stroke="#6B1026" strokeWidth="1.5" />
    <path d="M14 10 l6 -7 l6 7 l-6 6 z" fill="#0E5A45" stroke="#6B1026" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const Necklace = () => (
  <svg width="1.2em" height="1em" viewBox="0 0 48 40">
    <path d="M4 4 q20 40 40 0" fill="none" stroke="#E9B949" strokeWidth="4" strokeLinecap="round" />
    <path d="M24 26 l6 6 l-6 8 l-6 -8 z" fill="#C81E63" stroke="#6B1026" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const Heart = () => (
  <svg width="1em" height="1em" viewBox="0 0 40 40">
    <path d="M20 35 C4 24 2 14 8 8 c5 -5 11 -3 12 3 c1 -6 7 -8 12 -3 c6 6 4 16 -12 27 z" fill="#C81E63" stroke="#6B1026" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);
