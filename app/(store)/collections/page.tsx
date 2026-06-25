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
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-gold mb-4">
              Our Collections
            </h1>
            <p className="text-ivory/60 max-w-2xl mx-auto">
              Explore our curated collections of handcrafted jewellery, each piece a testament to artistry and elegance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plainCategories.map((category: any) => (
              <Link
                key={category._id}
                href={`/shop?category=${category.slug}`}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden border border-border card-hover zoom-hover shadow-sm"
              >
                {category.image?.url && (
                  <Image
                    src={category.image.url}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h2 className="font-display text-3xl text-white group-hover:text-sand transition-colors mb-2">
                    {category.name}
                  </h2>
                  <p className="text-white/70 text-sm">{category.description}</p>
                  <span className="inline-block mt-3 text-sand text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore →
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
