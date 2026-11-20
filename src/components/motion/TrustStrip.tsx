import { store } from "@/config/store";

/** Three small animated promises: shipping (truck drives), WhatsApp (bubble bounces), the shop (pin drops). */
export function TrustStrip({ compact = false }: { compact?: boolean }) {
  const items = [
    {
      icon: (
        <svg viewBox="0 0 48 32" className="ts-truck h-7 w-10">
          <rect x="2" y="6" width="26" height="16" rx="3" fill="#C81E63" />
          <path d="M28 11 h9 l7 7 v4 h-16 z" fill="#6B1026" />
          <circle cx="11" cy="25" r="4" fill="#2A0A18" stroke="#FFF7F2" strokeWidth="2" />
          <circle cx="36" cy="25" r="4" fill="#2A0A18" stroke="#FFF7F2" strokeWidth="2" />
          <path d="M-6 12 h6 M-8 17 h8" stroke="#E9B949" strokeWidth="2" strokeLinecap="round" className="ts-speed" />
        </svg>
      ),
      title: "Ships all over India",
      sub: `Free shipping on ₹${store.shipping.freeAbove}+`,
    },
    {
      icon: (
        <svg viewBox="0 0 32 32" className="ts-bubble h-7 w-7">
          <path d="M16 3C8.8 3 3 8.4 3 15c0 2.6.9 5 2.4 6.9L4 28l6.4-1.7c1.7.8 3.6 1.2 5.6 1.2 7.2 0 13-5.4 13-12S23.2 3 16 3z" fill="#0B6B45" />
          <circle cx="11" cy="15" r="1.8" fill="#fff" className="ts-dot" />
          <circle cx="16" cy="15" r="1.8" fill="#fff" className="ts-dot" style={{ animationDelay: ".15s" }} />
          <circle cx="21" cy="15" r="1.8" fill="#fff" className="ts-dot" style={{ animationDelay: ".3s" }} />
        </svg>
      ),
      title: "Order on WhatsApp",
      sub: "We confirm everything in chat",
    },
    {
      icon: (
        <svg viewBox="0 0 32 36" className="ts-pin h-8 w-7">
          <path d="M16 2C9.4 2 4 7.2 4 13.6 4 22 16 34 16 34s12-12 12-20.4C28 7.2 22.6 2 16 2z" fill="#C81E63" />
          <circle cx="16" cy="13.5" r="5" fill="#FFF7F2" />
        </svg>
      ),
      title: "Visit the shop",
      sub: `Roongtha SSRF Mall, ${store.city}`,
    },
  ];
  return (
    <ul className={`m-0 grid list-none gap-2.5 p-0 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
      {items.map((i) => (
        <li key={i.title} className="ts-item flex items-center gap-3 rounded-[18px] border border-line bg-paper px-4 py-3">
          <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blush">
            {i.icon}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[14px] font-bold text-ink">{i.title}</span>
            <span className="text-[12.5px] text-muted">{i.sub}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
