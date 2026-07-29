import { Suspense } from "react";
import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductCard from "@/components/shop/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface SearchParams {
  category?: string;
  metal?: string;
  stone?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  sort?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  await connectDB();

  // Build query
  const query: any = { isActive: true };
  
  if (searchParams.category) {
    const category = await Category.findOne({ slug: searchParams.category });
    if (category) query.category = category._id;
  }
  if (searchParams.metal) query.metal = searchParams.metal;
  if (searchParams.stone) query.stone = searchParams.stone;
  if (searchParams.minPrice || searchParams.maxPrice) {
    query.price = {};
    if (searchParams.minPrice) query.price.$gte = parseFloat(searchParams.minPrice);
    if (searchParams.maxPrice) query.price.$lte = parseFloat(searchParams.maxPrice);
  }
  if (searchParams.search) {
    query.$or = [
      { name: { $regex: searchParams.search, $options: "i" } },
      { description: { $regex: searchParams.search, $options: "i" } },
    ];
  }

  const sort = searchParams.sort || "-createdAt";

  const [products, categories] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .sort(sort)
      .limit(50)
      .lean(),
    Category.find({ isActive: true }).lean(),
  ]);

  const plainProducts = JSON.parse(JSON.stringify(products));
  const plainCategories = JSON.parse(JSON.stringify(categories));

  return (
    <>
      <Navbar user={session?.user} />
      <main className="min-h-screen bg-bg text-ivory">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <div className="mb-10 md:mb-14">
            <p className="text-gold/70 text-[11px] tracking-[0.3em] uppercase mb-2 font-medium">Collection</p>
            <h1 className="font-display text-3xl md:text-4xl text-ivory mb-2">Shop All Jewellery</h1>
            <p className="text-ivory/45 text-sm">
              {plainProducts.length} {plainProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          {/* Filters */}
          <div className="mb-10 flex flex-wrap gap-3 pb-8 border-b border-border">
            <select className="bg-transparent border border-border px-4 py-2.5 text-ivory/70 text-[13px] tracking-wide focus:border-gold focus:outline-none transition-colors cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a67c52%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[right_12px_center] bg-no-repeat">
              <option value="">All Categories</option>
              {plainCategories.map((cat: any) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select className="bg-transparent border border-border px-4 py-2.5 text-ivory/70 text-[13px] tracking-wide focus:border-gold focus:outline-none transition-colors cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23a67c52%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[right_12px_center] bg-no-repeat">
              <option value="">Sort By</option>
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratings.average">Top Rated</option>
            </select>
          </div>

          {/* Products Grid */}
          {plainProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12">
              {plainProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-ivory/40 text-sm">No products found matching your criteria.</p>
              <Link href="/shop" className="text-gold text-sm mt-3 inline-block hover:underline">
                Clear filters →
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
