import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ProductGallery from "@/components/shop/ProductGallery";
import { formatPrice, getMetalLabel, getStoneLabel, calculateDiscount } from "@/lib/utils";
import { auth } from "@/lib/auth";
import AddToCartButton from "@/components/shop/AddToCartButton";
import WishlistButton from "@/components/shop/WishlistButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  await connectDB();

  const product = await Product.findOne({ slug: params.slug })
    .populate("category", "name slug")
    .lean();

  if (!product) {
    notFound();
  }

  const plainProduct = JSON.parse(JSON.stringify(product));
  const discount = calculateDiscount(plainProduct.price, plainProduct.salePrice);
  const displayPrice = plainProduct.salePrice || plainProduct.price;

  return (
    <>
      <Navbar user={session?.user} />
      <main className="min-h-screen bg-bg text-ivory">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[12px] text-ivory/40 mb-8 md:mb-12 flex-wrap tracking-wide">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span className="text-ivory/20">/</span>
            <Link href="/shop" className="hover:text-gold transition-colors">Shop</Link>
            <span className="text-ivory/20">/</span>
            <Link href={`/shop?category=${plainProduct.category?.slug || ""}`} className="hover:text-gold transition-colors">
              {plainProduct.category?.name || "Category"}
            </Link>
            <span className="text-ivory/20">/</span>
            <span className="text-ivory/60">{plainProduct.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image Gallery */}
            <ProductGallery images={plainProduct.images} name={plainProduct.name} />

            {/* Product Info */}
            <div className="lg:py-4">
              <p className="text-gold/70 text-[11px] tracking-[0.2em] uppercase font-medium mb-3">
                {plainProduct.category?.name || "Jewellery"}
              </p>
              <h1 className="font-display text-2xl md:text-3xl lg:text-[2.25rem] text-ivory leading-tight mb-5">
                {plainProduct.name}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.round(plainProduct.ratings.average) ? "text-gold" : "text-ivory/15"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-ivory/40 text-[12px]">
                  {plainProduct.ratings.average.toFixed(1)} ({plainProduct.ratings.count})
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-border">
                <span className="text-2xl md:text-3xl font-semibold text-ivory">
                  {formatPrice(displayPrice)}
                </span>
                {plainProduct.salePrice && plainProduct.salePrice < plainProduct.price && (
                  <span className="text-lg text-ivory/30 line-through">
                    {formatPrice(plainProduct.price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-[11px] font-bold text-terracotta tracking-wide uppercase">
                    {discount}% Off
                  </span>
                )}
              </div>

              <p className="text-ivory/55 text-[15px] mb-8 leading-[1.7]">
                {plainProduct.description}
              </p>

              {/* Specifications */}
              <div className="mb-8 pb-8 border-b border-border">
                <h3 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ivory/60 mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ivory/40">Metal</span>
                    <span className="text-ivory/80 font-medium">{getMetalLabel(plainProduct.metal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ivory/40">Stone</span>
                    <span className="text-ivory/80 font-medium">{getStoneLabel(plainProduct.stone)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ivory/40">Weight</span>
                    <span className="text-ivory/80 font-medium">{plainProduct.weight}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ivory/40">SKU</span>
                    <span className="text-ivory/80 font-medium">{plainProduct.sku}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${plainProduct.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
                  <span className="text-[12px] text-ivory/50">
                    {plainProduct.stock > 0 ? `${plainProduct.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-10">
                <AddToCartButton product={plainProduct} />
                <WishlistButton product={plainProduct} />
              </div>

              {/* Trust */}
              <div className="flex items-center gap-6 text-ivory/40 text-[11px] tracking-wide">
                <span>Anti-Tarnish</span>
                <span className="w-px h-3 bg-border" />
                <span>Free Shipping ₹499+</span>
                <span className="w-px h-3 bg-border" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 md:mt-24 pt-12 border-t border-border">
            <div className="grid md:grid-cols-3 gap-10 md:gap-12">
              <div>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ivory/60 mb-4">Product Details</h2>
                <p className="text-ivory/50 leading-[1.7] text-sm">{plainProduct.description}</p>
              </div>
              <div>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ivory/60 mb-4">Care Instructions</h2>
                <ul className="text-ivory/50 space-y-2.5 text-sm leading-relaxed">
                  <li>Store in a cool, dry place</li>
                  <li>Clean with a soft cloth</li>
                  <li>Avoid contact with perfumes</li>
                  <li>Remove before bathing</li>
                </ul>
              </div>
              <div>
                <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ivory/60 mb-4">Shipping & Returns</h2>
                <ul className="text-ivory/50 space-y-2.5 text-sm leading-relaxed">
                  <li>Free shipping above ₹499</li>
                  <li>Standard: 5–7 business days</li>
                  <li>Express: 2–3 business days</li>
                  <li>30-day return policy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
