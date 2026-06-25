import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import WarliDivider from "@/components/ui/WarliDivider";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

export const dynamic = "force-dynamic";

const categories = [
  { name: "Rings", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop" },
  { name: "Necklaces", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop" },
  { name: "Earrings", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop" },
  { name: "Bracelets", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop" },
  { name: "Sets", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop" },
];

export default async function HomePage() {
  let user = null;
  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth();
    user = session?.user || null;
  } catch {}

  // Load editable settings
  let s: any = {};
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();
    s = settings || {};
  } catch {}

  const hero = {
    headline: s.heroHeadline || "Jewellery That",
    subheadline: s.heroSubheadline || "Tells a Story",
    description: s.heroDescription || "Handcrafted heirlooms rooted in tradition. Each piece is a quiet celebration of art, love, and timeless elegance.",
    cta1Text: s.heroCta1Text || "Shop Collection",
    cta1Link: s.heroCta1Link || "/shop",
    cta2Text: s.heroCta2Text || "Our Story",
    cta2Link: s.heroCta2Link || "/about",
  };

  const featured = {
    title: s.featuredTitle || "Bridal Collection",
    subtitle: s.featuredSubtitle || "Featured",
    description: s.featuredDescription || "Timeless pieces for your most cherished moments. Handcrafted with certified diamonds and 22K hallmarked gold.",
    link: s.featuredLink || "/shop",
    image: s.featuredImage || "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&h=700&fit=crop",
  };

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen">

        {/* ─── HERO ─── */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden py-16">
          <div className="container grid lg:grid-cols-2 items-center gap-12 relative z-10">
            <div>
              <div className="animate-fade-up">
                <p className="text-gold text-xs tracking-[0.35em] uppercase mb-4 font-semibold">
                  New Collection 2026
                </p>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ivory leading-[1.1] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                {hero.headline}<br />
                <span className="gradient-gold">{hero.subheadline}</span>
              </h1>
              <p className="text-ivory/60 md:text-lg max-w-md mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
                {hero.description}
              </p>
              <div className="flex gap-4 flex-col sm:flex-row animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <Link href={hero.cta1Link} className="btn-sheen bg-gold text-white px-9 py-3.5 rounded-full font-semibold tracking-wide transition-all hover:shadow-lg hover:shadow-gold/20 text-center">
                  {hero.cta1Text}
                </Link>
                <Link href={hero.cta2Link} className="border border-border text-ivory hover:border-gold hover:text-gold px-9 py-3.5 rounded-full font-semibold tracking-wide transition-all text-center">
                  {hero.cta2Text}
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                <Image src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&h=1200&fit=crop" alt="Luxury jewellery" fill priority className="object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-border animate-float">
                <p className="text-gold font-display text-2xl">10+</p>
                <p className="text-ivory/60 text-xs">Years of Artistry</p>
              </div>
              <div className="absolute top-6 -right-2 bg-gold text-white rounded-full px-4 py-2 text-xs font-semibold shadow-lg">
                ✦ Handcrafted
              </div>
            </div>
          </div>
          <div className="absolute top-1/3 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-sand/50 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* ─── VALUES ─── */}
        <section className="border-y border-border py-8 bg-white">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: "✦", title: "Handcrafted", sub: "Master artisans" },
              { icon: "◈", title: "BIS Hallmarked", sub: "Certified purity" },
              { icon: "❉", title: "Free Shipping", sub: "Above ₹5,000" },
              { icon: "↺", title: "Easy Returns", sub: "30-day policy" },
            ].map((v) => (
              <div key={v.title} className="reveal">
                <span className="text-gold text-xl">{v.icon}</span>
                <h3 className="font-display text-sm mt-1.5">{v.title}</h3>
                <p className="text-[11px] text-ivory/50">{v.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FEATURED CARD (editable from admin) ─── */}
        <section className="section container">
          <div className="reveal bg-white border border-border rounded-3xl overflow-hidden grid md:grid-cols-2 shadow-sm hover:shadow-lg transition-shadow duration-500">
            <div className="relative aspect-[4/3] md:aspect-auto zoom-hover">
              <Image src={featured.image} alt={featured.title} fill className="object-cover" />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3 font-semibold">{featured.subtitle}</p>
              <h2 className="font-display text-3xl md:text-4xl mb-4">{featured.title}</h2>
              <p className="text-ivory/55 mb-8 leading-relaxed">{featured.description}</p>
              <Link href={featured.link} className="btn-sheen bg-gold text-white px-8 py-3 rounded-full font-semibold self-start hover:shadow-lg hover:shadow-gold/20 transition-all">
                Explore Collection
              </Link>
            </div>
          </div>
        </section>

        {/* ─── CATEGORIES ─── */}
        <section className="section container">
          <div className="text-center mb-12 reveal">
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2 font-semibold">Browse</p>
            <h2 className="heading-1">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((cat, i) => (
              <Link key={cat.name} href={`/shop?category=${cat.name.toLowerCase()}`} className="reveal group relative aspect-[3/4] rounded-2xl overflow-hidden card-hover zoom-hover border border-border" style={{ transitionDelay: `${i * 60}ms` }}>
                <Image src={cat.img} alt={cat.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <h3 className="absolute bottom-5 left-5 font-display text-xl text-white group-hover:text-sand transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── TESTIMONIAL ─── */}
        <section className="section bg-white border-y border-border">
          <div className="container text-center max-w-2xl mx-auto reveal">
            <WarliDivider className="mb-8" />
            <blockquote className="font-serif-accent text-2xl md:text-3xl text-ivory/80 mb-6 leading-snug">
              &ldquo;The most beautiful necklace I&apos;ve ever owned. You can feel the love in every detail.&rdquo;
            </blockquote>
            <p className="text-gold font-semibold text-sm">Ananya Mehta</p>
            <p className="text-ivory/40 text-xs">Mumbai — Bridal Set Customer</p>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="section container">
          <div className="reveal text-center max-w-lg mx-auto">
            <h3 className="font-display text-2xl mb-3">Begin Your Journey</h3>
            <p className="text-ivory/50 text-sm mb-8">Browse our collection or message us on WhatsApp for a personalised experience.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/shop" className="btn-sheen bg-gold text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all">Explore Shop</Link>
              <Link href="/contact" className="border border-border text-ivory hover:border-gold hover:text-gold px-8 py-3 rounded-full font-semibold transition-all">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
