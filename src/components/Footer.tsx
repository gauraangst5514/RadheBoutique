import Link from "next/link";
import { categories, store } from "@/config/store";
import { waLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-[#FBE8EF]">
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-12 px-5 pb-10 pt-14 md:px-6">
        <div className="flex max-w-[400px] flex-1 basis-[320px] flex-col gap-3.5">
          <span className="font-serif-italic text-[30px] font-bold text-blush md:text-[34px]">{store.name}</span>
          <p className="m-0 text-[15px] leading-relaxed md:text-base">{store.address}</p>
          <div className="flex flex-wrap gap-3">
            <a href={waLink("Hi Radhe Boutique!")} className="rounded-full bg-blush px-5 py-3 text-[15px] font-bold text-ink no-underline">
              WhatsApp {store.phoneDisplay}
            </a>
            <a href={store.mapsUrl} className="rounded-full border-2 border-blush px-5 py-2.5 text-[15px] font-bold text-blush no-underline">
              Get directions
            </a>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-14 text-[15px]">
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-blush">Shop</span>
            {categories.map((c) => (
              <Link key={c.slug} href={`/shop/${c.slug}`} className="text-[#FBE8EF] no-underline hover:text-blush">
                {c.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-bold text-blush">Help</span>
            <Link href="/help#shipping" className="text-[#FBE8EF] no-underline hover:text-blush">Shipping &amp; payment</Link>
            <Link href="/help#returns" className="text-[#FBE8EF] no-underline hover:text-blush">Returns</Link>
            <Link href="/help#care" className="text-[#FBE8EF] no-underline hover:text-blush">Anti-tarnish care</Link>
            <a href={store.instagram} className="text-[#FBE8EF] no-underline hover:text-blush">Instagram</a>
          </div>
        </nav>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-[#E8C9D4]">
        © {new Date().getFullYear()} {store.name}, {store.city}
      </div>
    </footer>
  );
}
