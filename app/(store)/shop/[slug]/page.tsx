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
        <div className="container mx-auto px-4 pb-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-ivory/60 mb-8 flex-wrap">
            <Link href="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gold">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${plainProduct.category?.slug || ""}`} className="hover:text-gold">
              {plainProduct.category?.name || "Category"}
            </Link>
            <span>/</span>
            <span className="text-ivory">{plainProduct.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <ProductGallery images={plainProduct.images} name={plainProduct.name} />

            {/* Product Info */}
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-gold mb-4">
                {plainProduct.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.round(plainProduct.ratings.average) ? "text-gold" : "text-ivory/20"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-ivory/60 text-sm">
                  {plainProduct.ratings.average.toFixed(1)} ({plainProduct.ratings.count} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-gold">
                  {formatPrice(displayPrice)}
                </span>
                {plainProduct.salePrice && plainProduct.salePrice < plainProduct.price && (
                  <span className="text-xl text-ivory/40 line-through">
                    {formatPrice(plainProduct.price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-terracotta/20 text-terracotta text-xs font-bold px-2 py-1 rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <p className="text-ivory/75 mb-8 leading-relaxed">
                {plainProduct.description}
              </p>

              {/* Specifications */}
              <div className="bg-surface border border-border rounded-lg p-5 mb-8">
                <h3 className="font-display text-lg text-gold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-ivory/50">Metal:</span>
                    <span className="text-ivory ml-2 font-medium">{getMetalLabel(plainProduct.metal)}</span>
                  </div>
                  <div>
                    <span className="text-ivory/50">Stone:</span>
                    <span className="text-ivory ml-2 font-medium">{getStoneLabel(plainProduct.stone)}</span>
                  </div>
                  <div>
                    <span className="text-ivory/50">Weight:</span>
                    <span className="text-ivory ml-2 font-medium">{plainProduct.weight}g</span>
                  </div>
                  <div>
                    <span className="text-ivory/50">SKU:</span>
                    <span className="text-ivory ml-2 font-medium">{plainProduct.sku}</span>
                  </div>
                  <div>
                    <span className="text-ivory/50">Stock:</span>
                    <span className={`ml-2 font-medium ${plainProduct.stock > 0 ? "text-green-400" : "text-red-400"}`}>
                      {plainProduct.stock > 0 ? `${plainProduct.stock} available` : "Out of stock"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <AddToCartButton product={plainProduct} />
                <WishlistButton product={plainProduct} />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-5 border-t border-border">
                <div className="text-center">
                  <div className="text-gold text-xl mb-1">✦</div>
                  <p className="text-xs text-ivory/55">Anti-Tarnish</p>
                </div>
                <div className="text-center">
                  <div className="text-gold text-xl mb-1">❉</div>
                  <p className="text-xs text-ivory/55">Free Shipping</p>
                </div>
                <div className="text-center">
                  <div className="text-gold text-xl mb-1">↺</div>
                  <p className="text-xs text-ivory/55">30-Day Returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-16 border-t border-border pt-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h2 className="font-display text-xl text-gold mb-4">Product Details</h2>
                <p className="text-ivory/70 leading-relaxed text-sm">{plainProduct.description}</p>
              </div>
              <div>
                <h2 className="font-display text-xl text-gold mb-4">Care Instructions</h2>
                <ul className="text-ivory/70 space-y-2 text-sm">
                  <li>• Store in a cool, dry place</li>
                  <li>• Clean with a soft cloth</li>
                  <li>• Avoid contact with perfumes</li>
                  <li>• Remove before bathing</li>
                </ul>
              </div>
              <div>
                <h2 className="font-display text-xl text-gold mb-4">Shipping & Returns</h2>
                <ul className="text-ivory/70 space-y-2 text-sm">
                  <li>• Free shipping above ₹499</li>
                  <li>• Standard: 5-7 business days</li>
                  <li>• Express: 2-3 business days</li>
                  <li>• 30-day return policy</li>
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
