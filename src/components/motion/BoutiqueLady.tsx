import Link from "next/link";
import { store } from "@/config/store";

/**
 * Homepage section: an illustrated woman in a kurti and dupatta inside the boutique's arch.
 * Her jhumkas swing, the dupatta flutters, marigold petals drift down and sparkles twinkle.
 * Drawn in SVG with the site's colours; all motion is CSS ("Boutique lady" in globals.css).
 */
export function BoutiqueLady() {
  const petals = [
    { l: "8%", d: "0s", t: "9s", c: "#F28C28" },
    { l: "22%", d: "-3s", t: "11s", c: "#E9B949" },
    { l: "38%", d: "-6s", t: "10s", c: "#F28C28" },
    { l: "55%", d: "-1.5s", t: "12s", c: "#C81E63" },
    { l: "70%", d: "-4.5s", t: "9.5s", c: "#E9B949" },
    { l: "86%", d: "-7s", t: "11.5s", c: "#F28C28" },
  ];

  return (
    <section className="mx-auto max-w-[1320px] px-3 pt-12 md:px-6 md:pt-14" data-reveal>
      <div className="relative overflow-hidden rounded-[28px] bg-[#FBE3CF] text-maroon md:rounded-[32px]">
        {/* falling marigold petals */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {petals.map((p, k) => (
            <span
              key={k}
              className="lady-petal absolute -top-6 block h-3.5 w-2.5 rounded-[60%_40%_60%_40%]"
              style={{ left: p.l, background: p.c, animationDelay: p.d, animationDuration: p.t }}
            />
          ))}
        </div>

        <div className="relative flex flex-col-reverse items-center gap-4 p-6 md:flex-row md:gap-10 md:p-12">
          {/* copy */}
          <div className="flex flex-col gap-4 md:flex-1 md:gap-5">
            <span className="font-serif-italic text-xl text-pink md:text-2xl">Made for her, every day</span>
            <h2 className="font-display m-0 text-[52px] leading-[.9] md:text-[104px]">
              PEHNO ROZ,
              <br />
              <span className="kh-outline">CHAMKO</span> ROZ
            </h2>
            <p className="m-0 max-w-[460px] text-[15px] leading-relaxed text-[#5A2A1A] md:text-lg">
              From college to kitty parties and festive nights, there&apos;s a piece for every mood. Pick it online, or
              come try it on at our shop in {store.city}.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/shop/korean-earrings" className="group flex items-center gap-2 rounded-full bg-maroon px-6 py-3.5 text-[15px] font-bold text-[#FBE3CF] no-underline md:text-base">
                Find your piece <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <a href={store.mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-maroon px-5 py-3 text-[15px] font-bold text-maroon no-underline md:text-base">
                Visit the shop
              </a>
            </div>
          </div>

          {/* illustration */}
          <div aria-hidden className="relative w-[260px] shrink-0 md:w-[360px]">
            <span className="lady-twinkle absolute left-[2%] top-[14%] text-2xl text-gold">✦</span>
            <span className="lady-twinkle absolute right-[4%] top-[6%] text-xl text-pink" style={{ animationDelay: "-1s" }}>✦</span>
            <span className="lady-twinkle absolute right-[0%] top-[52%] text-lg text-gold" style={{ animationDelay: "-2s" }}>✦</span>
            <svg viewBox="0 0 320 420" className="relative block w-full">
              <defs>
                <clipPath id="lady-arch">
                  <path d="M20 420 V150 A140 140 0 0 1 300 150 V420 Z" />
                </clipPath>
                <pattern id="lady-butti" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="2" fill="#E9B949" />
                  <circle cx="16" cy="16" r="1.6" fill="#FBE3CF" />
                </pattern>
              </defs>

              {/* arch */}
              <path d="M20 420 V150 A140 140 0 0 1 300 150 V420 Z" fill="#F6C9D6" />
              <path d="M32 420 V152 A128 128 0 0 1 288 152 V420" fill="none" stroke="#E9B949" strokeWidth="3" strokeDasharray="6 8" />

              <g clipPath="url(#lady-arch)">
                {/* back dupatta trail */}
                <path className="lady-dupatta-back" d="M204 158 C236 196 252 260 262 340 C268 380 270 410 272 430 L232 430 C228 380 222 320 214 260 Z" fill="#C81E63" opacity=".85" />

                {/* palazzo */}
                <path d="M112 300 L100 430 L156 430 L160 318 L164 430 L220 430 L208 300 Z" fill="#FFF1DC" />
                <path d="M120 318 L114 430 M134 318 L132 430 M186 318 L188 430 M200 318 L206 430" stroke="#EBD5C4" strokeWidth="2" />

                {/* neck */}
                <rect x="150" y="118" width="20" height="28" rx="8" fill="#B87A5E" />

                {/* kurti */}
                <path d="M120 156 Q160 140 200 156 L222 304 Q160 322 98 304 Z" fill="#6B1026" />
                <path d="M120 156 Q160 140 200 156 L222 304 Q160 322 98 304 Z" fill="url(#lady-butti)" opacity=".9" />
                <path d="M100 296 Q160 314 220 296" fill="none" stroke="#E9B949" strokeWidth="7" />
                <path d="M100 296 Q160 314 220 296" fill="none" stroke="#6B1026" strokeWidth="2" strokeDasharray="2 6" />
                <path d="M146 146 L160 172 L174 146" fill="none" stroke="#E9B949" strokeWidth="4" strokeLinejoin="round" />

                {/* arms */}
                <path d="M122 162 L104 232" stroke="#6B1026" strokeWidth="20" strokeLinecap="round" />
                <path d="M104 232 L98 266" stroke="#B87A5E" strokeWidth="13" strokeLinecap="round" />
                <path d="M198 162 L222 220" stroke="#6B1026" strokeWidth="20" strokeLinecap="round" />
                <path d="M222 220 L200 246" stroke="#B87A5E" strokeWidth="13" strokeLinecap="round" />
                {/* bangles */}
                <path d="M95 250 l12 3 M94 255 l12 3" stroke="#E9B949" strokeWidth="3" strokeLinecap="round" />
                <path d="M210 236 l-9 -8 M206 240 l-9 -8" stroke="#E9B949" strokeWidth="3" strokeLinecap="round" />

                {/* front dupatta over the left shoulder */}
                <g className="lady-dupatta">
                  <path d="M116 152 C96 196 82 258 74 340 C70 380 68 410 66 430 L112 430 C110 380 112 320 118 262 C124 214 134 178 146 152 Z" fill="#F28C28" />
                  <path d="M116 152 C96 196 82 258 74 340 C70 380 68 410 66 430" fill="none" stroke="#E9B949" strokeWidth="5" />
                  <path d="M88 280 l6 4 M84 320 l6 4 M80 360 l6 4" stroke="#FFF1DC" strokeWidth="3" strokeLinecap="round" />
                </g>

                {/* necklace */}
                <path d="M146 142 Q160 160 174 142" fill="none" stroke="#E9B949" strokeWidth="3.5" />
                <circle cx="160" cy="156" r="4.5" fill="#0E5A45" stroke="#E9B949" strokeWidth="2" />

                {/* head */}
                <ellipse cx="160" cy="92" rx="29" ry="34" fill="#B87A5E" />
                {/* hair */}
                <circle className="lady-bun" cx="190" cy="66" r="17" fill="#2A0A18" />
                <circle cx="196" cy="58" r="4" fill="#C81E63" />
                <circle cx="186" cy="52" r="3" fill="#FFF1DC" />
                <path d="M130 96 C126 52 194 46 191 96 C186 72 168 62 160 64 C150 64 134 72 130 96 Z" fill="#2A0A18" />
                <path d="M160 64 L160 74" stroke="#C81E63" strokeWidth="2" />
                {/* face */}
                <circle cx="160" cy="80" r="2.6" fill="#C81E63" />
                <path d="M144 95 q5 4 10 0 M166 95 q5 4 10 0" fill="none" stroke="#2A0A18" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M152 110 q8 6 16 0" fill="none" stroke="#7A1E2E" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="146" cy="104" r="4" fill="#E58C8C" opacity=".45" />
                <circle cx="174" cy="104" r="4" fill="#E58C8C" opacity=".45" />

                {/* jhumkas */}
                <g className="lady-jhumka" style={{ transformOrigin: "131px 100px" }}>
                  <path d="M131 100 v6" stroke="#E9B949" strokeWidth="2" />
                  <path d="M123 114 a8 8 0 0 1 16 0 z" fill="#E9B949" />
                  <circle cx="125" cy="118" r="1.8" fill="#C81E63" />
                  <circle cx="131" cy="120" r="1.8" fill="#C81E63" />
                  <circle cx="137" cy="118" r="1.8" fill="#C81E63" />
                </g>
                <g className="lady-jhumka" style={{ transformOrigin: "189px 100px", animationDelay: "-.6s" }}>
                  <path d="M189 100 v6" stroke="#E9B949" strokeWidth="2" />
                  <path d="M181 114 a8 8 0 0 1 16 0 z" fill="#E9B949" />
                  <circle cx="183" cy="118" r="1.8" fill="#C81E63" />
                  <circle cx="189" cy="120" r="1.8" fill="#C81E63" />
                  <circle cx="195" cy="118" r="1.8" fill="#C81E63" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
