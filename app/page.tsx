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

const defaultCategories = [
  { name: "Rings", img: "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782812462/radhe-boutique/products/rb-001/rb-001-1.jpg" },
  { name: "Necklaces", img: "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782389667/radhe-boutique/products/fq42e11tzpzwqwopbvfs.jpg" },
  { name: "Earrings", img: "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782812507/radhe-boutique/products/rb-027/rb-027-1.jpg" },
  { name: "Bracelets", img: "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782405620/radhe-boutique/products/wcralhsxyrmyihdhvzkw.jpg" },
  { name: "Necklace Sets", img: "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782815801/radhe-boutique/products/rb-025/rb-025-1.jpg" },
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
  let categories: { name: string; slug: string; img: string }[] = [];
  try {
    await connectDB();
    const settings = await Settings.findOne().lean();
    s = settings || {};
    featuredProducts = await Product.find({ isActive: true, featured: true }).limit(4).lean();
    if (featuredProducts.length === 0) {
      featuredProducts = await Product.find({ isActive: true }).limit(4).lean();
    }
    featuredProducts = JSON.parse(JSON.stringify(featuredProducts));

    const dbCategories = await Category.find({ isActive: true }).lean();
    categories = JSON.parse(JSON.stringify(dbCategories)).map((c: any) => ({
      name: c.name,
      slug: c.slug,
      img: c.image?.url || defaultCategories.find((d) => d.name === c.name)?.img || "",
    }));
    if (categories.length === 0) {
      categories = defaultCategories.map((c) => ({ ...c, slug: c.name.toLowerCase() }));
    }
  } catch {}

  const hero = {
    headline: s.heroHeadline || "Jewellery That",
    subheadline: s.heroSubheadline || "Tells a Story",
    description: s.heroDescription || "Jewellery for every occasion — from everyday elegance to celebrations that matter. Anti-tarnish, long-lasting pieces designed to match your style, your moments, and your story.",
    cta1Text: s.heroCta1Text || "Browse Collection",
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
          <div className="absolute inset-0 warli-pattern opacity-30" />

          <div className="container relative z-10 grid lg:grid-cols-2 items-center gap-12 lg:gap-0 py-16 md:py-24 lg:py-32">
            {/* Left text */}
            <div className="max-w-xl">
              <p className="text-gold/80 text-[11px] tracking-[0.35em] uppercase mb-5 font-medium animate-fade-up">
                New Collection 2026
              </p>
              <h1 className="font-display text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] text-ivory leading-[1.05] mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                {hero.headline}<br />
                <span className="gradient-gold">{hero.subheadline}</span>
              </h1>
              <p className="text-ivory/50 text-[15px] md:text-base mb-10 leading-[1.7] max-w-md animate-fade-up" style={{ animationDelay: "0.2s" }}>
                {hero.description}
              </p>
              <div className="flex gap-4 flex-col sm:flex-row animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <Link href={hero.cta1Link} className="btn-sheen bg-ivory text-white px-8 py-3.5 font-medium text-[13px] tracking-[0.04em] uppercase transition-all hover:shadow-lg hover:shadow-black/10 text-center">
                  {hero.cta1Text}
                </Link>
                <Link href={hero.cta2Link} className="border border-ivory/20 text-ivory/70 hover:border-gold hover:text-gold px-8 py-3.5 font-medium text-[13px] tracking-[0.04em] uppercase transition-all text-center">
                  {hero.cta2Text}
                </Link>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative flex justify-center lg:justify-end animate-scale-in" style={{ animationDelay: "0.15s" }}>
              <div className="relative w-72 md:w-80 lg:w-[380px]">
                <div className="aspect-[3/4] overflow-hidden shadow-2xl shadow-black/8">
                  <Image
                    src="https://res.cloudinary.com/djxs8lcjg/image/upload/v1782815794/radhe-boutique/products/rb-028/rb-028-1.jpg"
                    alt="Luxury jewellery collection"
                    width={380}
                    height={507}
                    priority
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Floating accent image */}
                <div className="absolute -bottom-6 -left-10 md:-left-14 w-32 md:w-40 aspect-square overflow-hidden shadow-xl border-[5px] border-bg hidden sm:block">
                  <Image
                    src="https://res.cloudinary.com/djxs8lcjg/image/upload/v1782813132/radhe-boutique/products/rb-049/rb-049-1.jpg"
                    alt="Pearl earrings"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ TRENDING PRODUCTS ═══════ */}
        {featuredProducts.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-gold/70 text-[11px] tracking-[0.3em] uppercase mb-2 font-medium">Trending</p>
                  <h2 className="font-display text-2xl md:text-3xl text-ivory">Bestsellers</h2>
                </div>
                <Link href="/shop" className="text-ivory/50 text-[13px] font-medium hover:text-gold transition-colors hidden sm:block tracking-wide">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.map((product: any) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface mb-3">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      )}
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="absolute top-3 left-3 bg-ivory text-white text-[10px] font-bold px-2.5 py-1 tracking-wide uppercase">
                          Sale
                        </span>
                      )}
                    </div>
                    <h3 className="text-[13px] font-medium text-ivory/80 truncate group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gold font-semibold text-sm mt-1">
                      {formatPrice(product.salePrice || product.price)}
                      {product.salePrice && product.salePrice < product.price && (
                        <span className="text-ivory/35 text-xs line-through ml-2 font-normal">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </p>
                  </Link>
                ))}
              </div>
              <Link href="/shop" className="mt-8 block text-center text-ivory/50 text-[13px] font-medium hover:text-gold transition-colors sm:hidden tracking-wide">
                View All Products →
              </Link>
            </div>
          </section>
        )}

        {/* ═══════ CATEGORIES ═══════ */}
        <section className="py-16 md:py-24 border-y border-border">
          <div className="container">
            <div className="text-center mb-10 md:mb-14">
              <p className="text-gold/70 text-[11px] tracking-[0.3em] uppercase mb-2 font-medium">Browse</p>
              <h2 className="font-display text-2xl md:text-3xl text-ivory">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
              {categories.map((cat, i) => (
                <Link
                  key={cat.name}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative aspect-[3/4] overflow-hidden block"
                >
                  <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="(max-width: 768px) 50vw, 20vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <h3 className="font-display text-base md:text-lg text-white group-hover:text-sand transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-white/50 text-[11px] tracking-wide uppercase mt-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ WHY US ═══════ */}
        <section className="py-14 md:py-20 bg-surface border-y border-border">
          <div className="container">
            <div className="text-center mb-10">
              <p className="text-gold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-1 font-semibold">Why Choose Us</p>
              <h2 className="font-display text-2xl md:text-3xl text-ivory">Crafted with Care</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { title: "Anti-Tarnish", desc: "Long-lasting shine that stays beautiful over time", icon: (<svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>) },
                { title: "Premium Quality", desc: "Stainless steel & hypoallergenic materials", icon: (<svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>) },
                { title: "Free Delivery", desc: "Complimentary shipping on orders above ₹499", icon: (<svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v3.75m-7.5 9.75h7.5m-7.5 0a1.5 1.5 0 01-1.5-1.5m9 1.5a1.5 1.5 0 001.5-1.5m0 0V9.75m0 7.5a1.5 1.5 0 001.5-1.5V9.75m0 0a1.5 1.5 0 00-1.5-1.5h-1.875M15.75 9.75v4.5m-7.5-4.5v4.5M3.75 9.75h16.5" /></svg>) },
                { title: "Easy Returns", desc: "Hassle-free 30-day return & exchange policy", icon: (<svg className="w-7 h-7 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>) },
              ].map((v) => (
                <div key={v.title} className="text-center p-4 md:p-6 rounded-xl bg-bg/50 border border-border/50">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                    {v.icon}
                  </div>
                  <h3 className="font-display text-sm md:text-base text-ivory mb-1.5">{v.title}</h3>
                  <p className="text-xs text-ivory/50 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ INSTAGRAM ═══════ */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-10">
              <p className="text-gold/70 text-[11px] tracking-[0.3em] uppercase mb-2 font-medium">Follow Us</p>
              <h2 className="font-display text-2xl md:text-3xl text-ivory mb-3">@radheboutique5514</h2>
              <a
                href="https://instagram.com/radheboutique5514"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 text-[13px] font-medium hover:text-gold transition-colors"
              >
                View on Instagram →
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {[
                "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782813078/radhe-boutique/products/rb-042/rb-042-1.jpg",
                "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782815516/radhe-boutique/products/rb-038/rb-038-1.jpg",
                "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782813153/radhe-boutique/products/rb-041/rb-041-1.jpg",
                "https://res.cloudinary.com/djxs8lcjg/image/upload/v1782814637/radhe-boutique/products/rb-057/rb-057-1.jpg",
              ].map((img, i) => (
                <a
                  key={i}
                  href="https://instagram.com/radheboutique5514"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden"
                >
                  <Image src={img} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium tracking-wide uppercase">
                      View
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ CTA ═══════ */}
        <section className="py-16 md:py-20 border-t border-border">
          <div className="container text-center max-w-lg mx-auto">
            <h3 className="font-display text-xl md:text-2xl text-ivory mb-3">Begin Your Journey</h3>
            <p className="text-ivory/45 text-sm mb-8 leading-relaxed">
              Browse our collection or message us on WhatsApp for a personalised experience.
            </p>
            <div className="flex gap-4 justify-center flex-col sm:flex-row">
              <Link href="/shop" className="btn-sheen bg-ivory text-white px-8 py-3.5 font-medium text-[13px] tracking-[0.04em] uppercase transition-all hover:shadow-lg text-center">
                Explore Shop
              </Link>
              <a
                href="https://wa.me/919022013489?text=Hi!%20I%27m%20interested%20in%20your%20jewellery%20collection"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-green-600/30 text-green-700 hover:bg-green-600 hover:text-white px-8 py-3.5 font-medium text-[13px] tracking-[0.04em] uppercase transition-all text-center"
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
