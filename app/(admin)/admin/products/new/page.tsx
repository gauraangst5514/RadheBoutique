"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUploader from "@/components/admin/ImageUploader";
import toast from "react-hot-toast";
import { X, Plus } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    price: "",
    salePrice: "",
    category: "",
    metal: "gold",
    stone: "none",
    weight: "",
    sku: "",
    stock: "",
    featured: false,
    isActive: true,
    tags: "",
    images: [] as { url: string; publicId: string }[],
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => { if (d.success) setCategories(d.data); })
      .catch(() => {});
  }, []);

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const addImage = () => {
    const url = imageUrl.trim();
    if (!url) return;
    if (!url.startsWith("http")) { toast.error("Enter a valid image URL"); return; }
    setForm((p) => ({
      ...p,
      images: [...p.images, { url, publicId: `manual-${Date.now()}` }],
    }));
    setImageUrl("");
  };

  const removeImage = (idx: number) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.sku) {
      toast.error("Fill in required fields: Name, Price, Category, SKU");
      return;
    }
    if (form.images.length === 0) {
      toast.error("Add at least one product image");
      return;
    }

    setSaving(true);
    try {
      const slug = form.name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      const payload = {
        name: form.name,
        slug,
        shortDescription: form.shortDescription || form.name,
        description: form.description || form.shortDescription || form.name,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        category: form.category,
        metal: form.metal,
        stone: form.stone,
        weight: form.weight ? parseFloat(form.weight) : 0,
        sku: form.sku,
        stock: form.stock ? parseInt(form.stock) : 0,
        featured: form.featured,
        isActive: form.isActive,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        images: form.images,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create product");

      toast.success("Product created!");
      router.push("/admin/products");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ivory py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl">Add Product</h1>
          <Link href="/admin/products" className="text-gold hover:underline text-sm">← Back to Products</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Section title="Basic Information">
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Product Name *" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              <Input label="SKU *" value={form.sku} onChange={(e) => update("sku", e.target.value)} placeholder="e.g. RNG-004" required />
              <div className="md:col-span-2">
                <Input label="Short Description" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} placeholder="One-liner (max 150 chars)" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Full Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                  placeholder="Detailed product description"
                />
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Pricing & Stock">
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Price (₹) *" type="number" value={form.price} onChange={(e) => update("price", e.target.value)} required />
              <Input label="Sale Price (₹)" type="number" value={form.salePrice} onChange={(e) => update("salePrice", e.target.value)} placeholder="Leave empty if no sale" />
              <Input label="Stock Quantity" type="number" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
            </div>
          </Section>

          {/* Category & Attributes */}
          <Section title="Category & Attributes">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                >
                  <option value="">Select Category</option>
                  {categories.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Metal</label>
                <select value={form.metal} onChange={(e) => update("metal", e.target.value)} className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold">
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="platinum">Platinum</option>
                  <option value="rose-gold">Rose Gold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Stone</label>
                <select value={form.stone} onChange={(e) => update("stone", e.target.value)} className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold">
                  <option value="none">No Stone</option>
                  <option value="diamond">Diamond</option>
                  <option value="ruby">Ruby</option>
                  <option value="emerald">Emerald</option>
                  <option value="sapphire">Sapphire</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Input label="Weight (grams)" type="number" value={form.weight} onChange={(e) => update("weight", e.target.value)} />
              <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="bridal, gold, ring" />
              <div className="flex items-center gap-6 md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} className="accent-gold w-4 h-4" />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="accent-gold w-4 h-4" />
                  <span className="text-sm">Active (visible in shop)</span>
                </label>
              </div>
            </div>
          </Section>

          {/* Images */}
          <Section title="Product Images">
            <ImageUploader
              images={form.images}
              onChange={(imgs) => update("images", imgs)}
            />
            {/* Fallback: paste URL manually */}
            <div className="mt-4 flex gap-2">
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or paste image URL"
                className="flex-1 px-4 py-2.5 bg-white border border-border rounded-md text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addImage(); } }}
              />
              <Button type="button" size="sm" onClick={addImage}><Plus size={16} /></Button>
            </div>
          </Section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => router.push("/admin/products")}>Cancel</Button>
            <Button type="submit" isLoading={saving}>Create Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <h2 className="font-display text-lg mb-4">{title}</h2>
      {children}
    </div>
  );
}
