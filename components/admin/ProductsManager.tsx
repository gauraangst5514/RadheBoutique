"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Trash2, Eye, EyeOff, CheckSquare } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  isActive: boolean;
  images: { url: string; publicId: string }[];
  category?: { name: string };
}

export default function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const allSelected = products.length > 0 && selected.size === products.length;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(products.map((p) => p._id)));
    }
  };

  const bulkAction = async (action: "delete" | "activate" | "deactivate") => {
    if (selected.size === 0) { toast.error("Select products first"); return; }

    const label = action === "delete" ? "delete" : action === "activate" ? "activate" : "deactivate";
    if (!confirm(`${label.charAt(0).toUpperCase() + label.slice(1)} ${selected.size} product(s)?`)) return;

    setBusy(true);
    let successCount = 0;

    for (const id of Array.from(selected)) {
      try {
        if (action === "delete") {
          const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
          if (res.ok) { successCount++; setProducts((p) => p.filter((x) => x._id !== id)); }
        } else {
          const isActive = action === "activate";
          const res = await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive }),
          });
          if (res.ok) {
            successCount++;
            setProducts((p) => p.map((x) => x._id === id ? { ...x, isActive } : x));
          }
        }
      } catch {}
    }

    toast.success(`${successCount} product(s) ${label}d`);
    setSelected(new Set());
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-bg text-ivory py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl text-ivory">Products</h1>
            <p className="text-ivory/50 text-sm">{products.length} total</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="text-gold hover:underline text-sm self-center">← Dashboard</Link>
            <Link href="/admin/products/new" className="bg-gold text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
              + Add Product
            </Link>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selected.size > 0 && (
          <div className="bg-white border border-border rounded-xl p-3 mb-4 flex items-center gap-3 flex-wrap shadow-sm">
            <span className="text-sm font-medium">{selected.size} selected</span>
            <Button size="sm" variant="ghost" onClick={() => bulkAction("activate")} isLoading={busy}>
              <Eye size={14} className="mr-1" /> Activate
            </Button>
            <Button size="sm" variant="ghost" onClick={() => bulkAction("deactivate")} isLoading={busy}>
              <EyeOff size={14} className="mr-1" /> Deactivate
            </Button>
            <Button size="sm" variant="danger" onClick={() => bulkAction("delete")} isLoading={busy}>
              <Trash2 size={14} className="mr-1" /> Delete
            </Button>
            <button onClick={() => setSelected(new Set())} className="text-xs text-ivory/50 hover:text-ivory ml-auto">
              Clear selection
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-sand/40 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-gold w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-ivory/60">Product</th>
                <th className="px-4 py-3 text-left font-medium text-ivory/60">Category</th>
                <th className="px-4 py-3 text-left font-medium text-ivory/60">Price</th>
                <th className="px-4 py-3 text-left font-medium text-ivory/60">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-ivory/60">Status</th>
                <th className="px-4 py-3 text-right font-medium text-ivory/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-sand/20 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(product._id)}
                      onChange={() => toggleSelect(product._id)}
                      className="accent-gold w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden bg-sand/30">
                        {product.images[0] && (
                          <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-ivory">{product.name}</p>
                        <p className="text-ivory/45 text-xs">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ivory/60">{product.category?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-ivory font-semibold">{formatPrice(product.salePrice || product.price)}</span>
                    {product.salePrice && product.salePrice < product.price && (
                      <span className="text-ivory/40 text-xs line-through ml-1.5">{formatPrice(product.price)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-600" : "text-red-600"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={product.isActive ? "success" : "danger"}>
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${product._id}/edit`} className="text-gold hover:underline text-sm mr-3">
                      Edit
                    </Link>
                    <Link href={`/shop/${product.slug}`} className="text-ivory/50 hover:text-ivory text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
