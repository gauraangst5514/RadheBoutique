import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const INSTAGRAM = process.env.NEXT_PUBLIC_BRAND_INSTAGRAM || "@radheboutique";
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM.replace("@", "")}`;

const instagramPosts = [
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop",
];

const values = [
  { icon: "✨", title: "Handcrafted", desc: "Every piece made by master artisans with decades of experience" },
  { icon: "💎", title: "Certified", desc: "BIS Hallmarked gold and GIA certified diamonds" },
  { icon: "🎨", title: "Bespoke Design", desc: "Custom designs tailored to your vision and style" },
  { icon: "🌿", title: "Ethically Sourced", desc: "Conflict-free stones and responsibly mined metals" },
];

const milestones = [
  { number: "10+", label: "Years of Craftsmanship" },
  { number: "5000+", label: "Happy Customers" },
  { number: "2000+", label: "Unique Designs" },
  { number: "100%", label: "Certified Jewellery" },
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
                    alt="Craftsmanship"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gold text-bg p-6 rounded-lg hidden md:block">
                  <p className="font-display text-3xl">10+</p>
                  <p className="text-sm">Years of Excellence</p>
                </div>
              </div>
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-gold mb-6">
                  Where Heritage Meets Modernity
                </h2>
                <div className="space-y-4 text-ivory/80 leading-relaxed">
                  <p>
                    Founded with a passion for timeless beauty, Radhe Boutique brings together 
                    generations of goldsmithing expertise with contemporary aesthetics. Our atelier 
                    in Mumbai is where dreams take shape in gold, diamonds, and precious gemstones.
                  </p>
                  <p>
                    Every creation undergoes meticulous quality checks — from the purity of the 
                    metal to the clarity of each stone. We don&apos;t just make jewellery; we craft 
                    heirlooms meant to be cherished across generations.
                  </p>
                  <p>
                    Our designers draw inspiration from nature, architecture, and the rich cultural 
                    tapestry of India — blending it with sleek, modern sensibilities that resonate 
                    with today&apos;s discerning woman.
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

        {/* Values */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-gold mb-4">What Sets Us Apart</h2>
              <p className="text-ivory/60 max-w-2xl mx-auto">
                Every piece from Radhe Boutique is a promise of quality, authenticity, and timeless beauty.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-surface border border-border rounded-lg p-6 text-center hover:border-gold/50 transition-colors"
                >
                  <div className="text-4xl mb-4">{v.icon}</div>
                  <h3 className="font-display text-xl text-gold mb-2">{v.title}</h3>
                  <p className="text-ivory/60 text-sm">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Craftsmanship Process */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl text-gold mb-4">From Sketch to Sparkle</h2>
              <p className="text-ivory/60 max-w-2xl mx-auto">
                A glimpse into our meticulous creation process
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Design", desc: "Hand-sketched by our in-house designers" },
                { step: "02", title: "Craft", desc: "Master artisans bring the design to life" },
                { step: "03", title: "Quality Check", desc: "Every gem and joint inspected" },
                { step: "04", title: "Delivered", desc: "Luxuriously packaged to your doorstep" },
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

            {/* Instagram Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {instagramPosts.map((img, i) => (
                <a
                  key={i}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`Instagram post ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/60 transition-colors flex items-center justify-center">
                    <span className="text-gold opacity-0 group-hover:opacity-100 transition-opacity font-semibold text-lg">
                      View on IG
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Featured Reels Section */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h3 className="font-display text-2xl text-gold mb-2">Featured Reels</h3>
                <p className="text-ivory/60 text-sm">Watch our latest styling videos and behind-the-scenes content</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { thumb: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=700&fit=crop", title: "Bridal Collection 2025" },
                  { thumb: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=700&fit=crop", title: "Making of a Necklace" },
                  { thumb: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=700&fit=crop", title: "Styling Tips" },
                  { thumb: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=700&fit=crop", title: "Customer Unboxing" },
                ].map((reel, i) => (
                  <a
                    key={i}
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-[9/16] rounded-lg overflow-hidden bg-surface border border-border hover:border-gold transition-all"
                  >
                    <Image
                      src={reel.thumb}
                      alt={reel.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                      <p className="text-ivory text-xs font-semibold truncate">{reel.title}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-surface/30 border-y border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="text-gold text-3xl mb-4">★★★★★</div>
            <blockquote className="font-display text-2xl md:text-3xl text-ivory italic mb-6">
              &ldquo;The most beautiful jewellery I&apos;ve ever owned. The craftsmanship is unparalleled 
              and the personal touch from the Radhe Boutique team made the experience truly special.&rdquo;
            </blockquote>
            <p className="text-gold font-semibold">Ananya Mehta</p>
            <p className="text-ivory/60 text-sm">Mumbai — Bridal Set Customer</p>
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
