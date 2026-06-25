import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import Product from "@/models/Product";
import Category from "@/models/Category";

void Category;

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

  let s: any = {};
  let featuredProducts: any[] = [];
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();
    s = settings || {};
    featuredProducts = await Product.find({ isActive: true, featured: true }).limit(4).lean();
    if (featuredProducts.length === 0) {
      featuredProducts = await Product.find({ isActive: true }).limit(4).lean();
    }
    featuredProducts = JSON.parse(JSON.stringify(featuredProducts));
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

  const formatPrice = (p: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(p);

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen">

        {/* ═══════ HERO ═══════ */}
        <section className="relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 warli-pattern opacity-40" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="container relative z-10 grid lg:grid-cols-2 items-center gap-8 lg:gap-0 py-12 md:py-20 lg:py-24">
            {/* Left text */}
            <div className="max-w-lg">
              <p className="text-gold text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 font-semibold animate-fade-up">
                New Collection 2026
              </p>
              <h1 className="font-display text-[2.5rem] md:text-5xl lg:text-6xl text-ivory leading-[1.08] mb-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                {hero.headline}<br />
                <span className="gradient-gold">{hero.subheadline}</span>
              </h1>
              <p className="text-ivory/55 text-sm md:text-base mb-8 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
                {hero.description}
              </p>
              <div className="flex gap-3 flex-col sm:flex-row animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <Link href={hero.cta1Link} className="btn-sheen bg-gold text-white px-8 py-3 rounded-full font-semibold text-sm transition-all hover:shadow-lg hover:shadow-gold/25 text-center">
                  {hero.cta1Text}
                </Link>
                <Link href={hero.cta2Link} className="border border-border text-ivory hover:border-gold hover:text-gold px-8 py-3 rounded-full font-semibold text-sm transition-all text-center">
                  {hero.cta2Text}
                </Link>
              </div>

              {/* Trust badges inline */}
              <div className="flex items-center gap-6 mt-10 text-ivory/40 text-xs animate-fade-up" style={{ animationDelay: "0.4s" }}>
                <span className="flex items-center gap-1.5">✦ Handcrafted</span>
                <span className="flex items-center gap-1.5">◈ Hallmarked</span>
                <span className="flex items-center gap-1.5">❉ Free Shipping</span>
              </div>
            </div>

            {/* Right: Image collage */}
            <div className="relative flex justify-center lg:justify-end animate-scale-in" style={{ animationDelay: "0.15s" }}>
              <div className="relative w-64 md:w-80 lg:w-[360px]">
                {/* Main image */}
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-border">
                  <Image
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=1100&fit=crop"
                    alt="Luxury jewellery collection"
                    width={360}
                    height={480}
                    priority
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Floating smaller image */}
                <div className="absolute -bottom-4 -left-8 md:-left-12 w-28 md:w-36 aspect-square rounded-xl overflow-hidden shadow-xl border-4 border-bg hidden sm:block">
                  <Image
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop"
                    alt="Gold ring"
                    width={144}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Stat card */}
                <div className="absolute -top-2 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 border border-border hidden sm:block">
                  <p className="text-gold font-display text-2xl leading-none">10+</p>
                  <p className="text-ivory/50 text-[10px] mt-0.5">Years of Artistry</p>
                </div>
                {/* Badge */}
                <div className="absolute top-6 -right-2 bg-gold text-white rounded-full px-3 py-1.5 text-[10px] font-semibold shadow-md">
                  ✦ BIS Certified
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ TRENDING PRODUCTS ═══════ */}
        {featuredProducts.length > 0 && (
          <section className="py-12 md:py-20 bg-white border-y border-border">
            <div className="container">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p className="text-gold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-1 font-semibold">Trending</p>
                  <h2 className="font-display text-2xl md:text-3xl text-ivory">Bestsellers</h2>
                </div>
                <Link href="/shop" className="text-gold text-sm font-semibold hover:underline underline-offset-4 hidden sm:block">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {featuredProducts.map((product: any) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    className="group bg-bg rounded-xl overflow-hidden border border-border card-hover"
                  >
                    <div className="relative aspect-square overflow-hidden zoom-hover">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      )}
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          SALE
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="text-sm font-medium text-ivory truncate group-hover:text-gold transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="text-gold font-semibold text-sm">
                          {formatPrice(product.salePrice || product.price)}
                        </span>
                        {product.salePrice && product.salePrice < product.price && (
                          <span className="text-ivory/40 text-xs line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/shop" className="mt-6 block text-center text-gold text-sm font-semibold hover:underline sm:hidden">
                View All Products →
              </Link>
            </div>
          </section>
        )}

        {/* ═══════ CATEGORIES ═══════ */}
        <section className="py-12 md:py-20 container">
          <div className="text-center mb-8 reveal">
            <p className="text-gold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-1 font-semibold">Browse</p>
            <h2 className="font-display text-2xl md:text-3xl text-ivory">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.name}
                href={`/shop?category=${cat.name.toLowerCase()}`}
                className="reveal group relative aspect-[3/4] rounded-xl overflow-hidden card-hover zoom-hover border border-border"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <Image src={cat.img} alt={cat.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <h3 className="absolute bottom-3 left-3 font-display text-base md:text-lg text-white group-hover:text-sand transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════ WHY US ═══════ */}
        <section className="py-10 md:py-16 bg-white border-y border-border">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: "✦", title: "Handcrafted", desc: "By master artisans" },
              { icon: "◈", title: "BIS Hallmarked", desc: "Certified 22K gold" },
              { icon: "🚚", title: "Free Delivery", desc: "Orders above ₹499" },
              { icon: "↺", title: "Easy Returns", desc: "30-day policy" },
            ].map((v) => (
              <div key={v.title} className="text-center reveal">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold text-lg md:text-xl">{v.icon}</span>
                </div>
                <h3 className="font-display text-sm md:text-base text-ivory">{v.title}</h3>
                <p className="text-[11px] text-ivory/45 mt-0.5">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ INSTAGRAM / SOCIAL PROOF ═══════ */}
        <section className="py-12 md:py-20 container">
          <div className="text-center mb-8 reveal">
            <p className="text-gold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-1 font-semibold">Follow Us</p>
            <h2 className="font-display text-2xl md:text-3xl text-ivory mb-2">@radheboutique</h2>
            <a
              href="https://instagram.com/radheboutique"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold text-sm font-medium hover:underline"
            >
              View on Instagram →
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {[
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop",
              "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop",
            ].map((img, i) => (
              <a
                key={i}
                href="https://instagram.com/radheboutique"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl overflow-hidden zoom-hover"
              >
                <Image src={img} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold">
                    View Post
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ═══════ CTA ═══════ */}
        <section className="py-12 md:py-16 bg-gold/5 border-y border-gold/10">
          <div className="container text-center max-w-lg mx-auto reveal">
            <h3 className="font-display text-xl md:text-2xl text-ivory mb-2">Begin Your Journey</h3>
            <p className="text-ivory/50 text-sm mb-6">
              Browse our collection or message us on WhatsApp for a personalised experience.
            </p>
            <div className="flex gap-3 justify-center flex-col sm:flex-row">
              <Link href="/shop" className="btn-sheen bg-gold text-white px-7 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all text-sm">
                Explore Shop
              </Link>
              <a
                href="https://wa.me/919022013489?text=Hi!%20I%27m%20interested%20in%20your%20jewellery%20collection"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-500 text-green-700 hover:bg-green-500 hover:text-white px-7 py-2.5 rounded-full font-semibold transition-all text-sm"
              >
                💬 Chat on WhatsApp
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
