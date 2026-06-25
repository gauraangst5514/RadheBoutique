import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

// Ensure Category model is registered for populate
void Category;

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session || !session.user || (session.user as any).role !== "admin") {
    redirect("/");
  }

  await connectDB();
  const products = await Product.find()
    .populate("category", "name")
    .sort("-createdAt")
    .lean();

  const plainProducts = JSON.parse(JSON.stringify(products));

  return (
    <div className="min-h-screen bg-bg text-ivory py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="heading-1 text-gold mb-2">Products Management</h1>
            <p className="text-ivory/60">{plainProducts.length} total products</p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-gold text-bg px-6 py-3 rounded-sm font-semibold hover:bg-gold/90 transition-colors"
          >
            Add New Product
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plainProducts.map((product: any) => (
                  <tr key={product._id} className="border-b border-border hover:bg-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          {product.images[0] && (
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-ivory">{product.name}</p>
                          <p className="text-sm text-ivory/60">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ivory/80">
                      {product.category?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-gold font-semibold">
                          {formatPrice(product.salePrice || product.price)}
                        </p>
                        {product.salePrice && (
                          <p className="text-sm text-ivory/40 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={product.stock > 10 ? "text-green-500" : product.stock > 0 ? "text-yellow-500" : "text-red-500"}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product._id}/edit`}
                          className="text-gold hover:text-gold/80 text-sm"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/shop/${product.slug}`}
                          className="text-ivory/60 hover:text-ivory text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/admin" className="text-gold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
