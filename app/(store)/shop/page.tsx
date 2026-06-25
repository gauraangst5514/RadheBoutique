import { Suspense } from "react";
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
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-1 text-gold mb-2">Shop All Jewellery</h1>
            <p className="text-ivory/60">
              {plainProducts.length} {plainProducts.length === 1 ? "product" : "products"} found
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap gap-4">
            <select className="bg-surface border border-border rounded px-4 py-2 text-ivory">
              <option value="">All Categories</option>
              {plainCategories.map((cat: any) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select className="bg-surface border border-border rounded px-4 py-2 text-ivory">
              <option value="">Sort By</option>
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-ratings.average">Top Rated</option>
            </select>
          </div>

          {/* Products Grid */}
          {plainProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {plainProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-ivory/60">No products found</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
