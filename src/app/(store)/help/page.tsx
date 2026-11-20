import { store } from "@/config/store";
import { waLink } from "@/lib/whatsapp";
import { PageBanner } from "@/components/motion/PageBanner";

export const metadata = { title: "Help" };

export default function Help() {
  return (
    <div className="mx-auto max-w-[760px] px-5 pt-8 md:pt-12">
      <PageBanner title="Help" eyebrow="Koi sawaal?" line="Shipping, returns and caring for your jewellery." />

      <section id="shipping" className="mt-10">
        <h2 className="m-0 text-xl font-bold">Shipping &amp; payment</h2>
        {/* TODO: replace with the real courier timelines and charges */}
        <p className="text-[15px] leading-relaxed text-[#4A2A36]">
          We ship across India. Shipping is free on orders of ₹{store.shipping.freeAbove} or more, and ₹{store.shipping.flatFee} below that. Place your order on WhatsApp from checkout, and we&apos;ll confirm the order and payment details in chat. We don&apos;t offer cash on delivery. You&apos;ll get a WhatsApp update when your parcel is on its way.
        </p>
      </section>

      <section id="returns" className="mt-8">
        <h2 className="m-0 text-xl font-bold">Returns</h2>
        {/* TODO: write the shop's return policy */}
        <p className="text-[15px] leading-relaxed text-[#4A2A36]">[Return policy to be added by the shop.]</p>
      </section>

      <section id="care" className="mt-8">
        <h2 className="m-0 text-xl font-bold">Anti-tarnish care</h2>
        <p className="text-[15px] leading-relaxed text-[#4A2A36]">
          Put perfume and lotion on before your jewellery, wipe it with a soft cloth after wearing, and keep each piece in its zip pouch.
        </p>
      </section>

      <a href={waLink("Hi Radhe Boutique, I need help with my order.")} className="mt-8 inline-flex rounded-full bg-ink px-6 py-3.5 font-bold text-cream no-underline">
        Ask us on WhatsApp ({store.phoneDisplay})
      </a>
    </div>
  );
}
