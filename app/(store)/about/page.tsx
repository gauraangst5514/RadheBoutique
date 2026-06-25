import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const INSTAGRAM = process.env.NEXT_PUBLIC_BRAND_INSTAGRAM || "@radheboutique";
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM.replace("@", "")}`;

const milestones = [
  { number: "5000+", label: "Happy Customers" },
  { number: "2000+", label: "Unique Designs" },
  { number: "100%", label: "Anti-Tarnish" },
  { number: "30 Day", label: "Easy Returns" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-bg text-ivory">
        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="w-16 h-px bg-gold mx-auto mb-6" />
            <h1 className="font-display text-5xl md:text-6xl text-gold mb-6">Our Story</h1>
            <p className="text-xl text-blush font-display italic mb-4">Crafted for Eternity</p>
            <p className="text-ivory/70 max-w-3xl mx-auto text-lg leading-relaxed">
              At Radhe Boutique, we believe jewellery is more than adornment — it&apos;s emotion 
              captured in metal and stone. Each piece carries the warmth of tradition and the 
              brilliance of modern design.
            </p>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800"
                    alt="Our jewellery"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-6">
                  Anti-Tarnish Jewellery That Lasts
                </h2>
                <div className="space-y-4 text-ivory/80 leading-relaxed">
                  <p>
                    At Radhe Boutique, we believe jewellery should look as beautiful on day 1000 
                    as it does on day 1. That&apos;s why every piece features our premium anti-tarnish 
                    coating — designed to resist wear, moisture, and daily use.
                  </p>
                  <p>
                    We source the finest materials and apply advanced protective finishes that 
                    keep your jewellery shining without constant maintenance. No green marks, 
                    no fading, no dullness — just lasting beauty.
                  </p>
                  <p>
                    Our collection blends traditional Indian aesthetics with modern durability, 
                    giving you pieces you can wear confidently every day or save for special moments.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="inline-block mt-8 bg-gold text-bg px-8 py-3 rounded-sm font-semibold hover:bg-gold/90 transition-colors"
                >
                  Explore Our Collection
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones */}
        <section className="py-16 border-y border-border bg-surface/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {milestones.map((m) => (
                <div key={m.label}>
                  <p className="font-display text-4xl md:text-5xl text-gold mb-2">{m.number}</p>
                  <p className="text-ivory/60 text-sm">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-gold mb-4">Why Choose Us</h2>
              <p className="text-ivory/60 max-w-2xl mx-auto">
                What makes Radhe Boutique the best in the market
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Anti-Tarnish", desc: "Premium coating that keeps your jewellery shining forever" },
                { step: "02", title: "Long Lasting", desc: "Built to be worn daily without losing its beauty" },
                { step: "03", title: "Quality Tested", desc: "Every piece passes strict quality inspection" },
                { step: "04", title: "Fast Delivery", desc: "Beautifully packaged to your doorstep" },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                    <span className="font-display text-xl text-gold">{s.step}</span>
                  </div>
                  <h3 className="font-semibold text-ivory mb-1">{s.title}</h3>
                  <p className="text-ivory/60 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instagram Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-gold mb-4">
                Follow Us on Instagram
              </h2>
              <p className="text-ivory/60 mb-2">
                Behind-the-scenes, new drops, and styling inspiration
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 font-semibold transition-colors"
              >
                {INSTAGRAM} →
              </a>
            </div>

            {/* Instagram Reels - Real Embeds */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "https://www.instagram.com/reel/DTABLGLk-Tc/",
                "https://www.instagram.com/reel/DTSdg3EEz_C/",
                "https://www.instagram.com/reel/DZ5NIvQN1tR/",
                "https://www.instagram.com/reel/DZ27jw-T-1N/",
              ].map((url, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border bg-white">
                  <iframe
                    src={`${url}embed/`}
                    className="w-full h-[480px] sm:h-[520px]"
                    frameBorder="0"
                    scrolling="no"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-surface/30 border-y border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="text-gold text-3xl mb-4">★★★★★</div>
            <blockquote className="font-display text-2xl md:text-3xl text-ivory italic mb-6">
              &ldquo;I&apos;ve been wearing their necklace daily for 6 months — not a single sign of tarnish. 
              The quality is unmatched. Absolutely the best jewellery I&apos;ve bought online.&rdquo;
            </blockquote>
            <p className="text-gold font-semibold">Priya Sharma</p>
            <p className="text-ivory/60 text-sm">Pune — Repeat Customer</p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-gold mb-4">
              Ready to Find Your Piece?
            </h2>
            <p className="text-ivory/60 mb-8 max-w-xl mx-auto">
              Browse our collection or reach out on WhatsApp for a personalized consultation.
            </p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row items-center">
              <Link
                href="/shop"
                className="bg-gold text-bg px-8 py-3 rounded-sm font-semibold hover:bg-gold/90 transition-colors"
              >
                Shop Now
              </Link>
              <a
                href={`https://wa.me/919022013489?text=${encodeURIComponent("Hi! I'd like to know more about your jewellery collection.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-gold text-gold px-8 py-3 rounded-sm font-semibold hover:bg-gold hover:text-bg transition-all"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
