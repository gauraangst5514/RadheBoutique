import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  await connectDB();
  const categories = await Category.find({ isActive: true }).lean();
  const plainCategories = JSON.parse(JSON.stringify(categories));

  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-bg text-ivory">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-gold/70 text-[11px] tracking-[0.3em] uppercase mb-3 font-medium">Explore</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ivory mb-4">
              Our Collections
            </h1>
            <p className="text-ivory/45 max-w-md mx-auto text-[15px] leading-relaxed">
              Curated categories of handcrafted jewellery, each piece a testament to artistry and elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {plainCategories.map((category: any) => (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden block"
              >
                {category.image?.url && (
                  <Image
                    src={category.image.url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h2 className="font-display text-2xl md:text-3xl text-white group-hover:text-sand transition-colors mb-1.5">
                    {category.name}
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-3">{category.description}</p>
                  <span className="text-sand/80 text-[12px] tracking-[0.1em] uppercase font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
