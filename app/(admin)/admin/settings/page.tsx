"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ]).then(([settingsData, catData]) => {
      if (settingsData.success) setSettings(settingsData.data);
      if (catData.success) setCategories(catData.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Settings saved! Refresh the storefront to see changes.");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-ivory flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ivory py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-ivory mb-1">Store Settings</h1>
            <p className="text-ivory/50 text-sm">Edit your storefront text and images</p>
          </div>
          <Link href="/admin" className="text-gold hover:underline text-sm">← Dashboard</Link>
        </div>

        <div className="space-y-8">
          {/* Announcement Bar */}
          <Section title="Announcement Bar" desc="Displayed at the top of the storefront. Customers can dismiss it.">
            <div className="flex items-center gap-3 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.announcementEnabled ?? true}
                  onChange={(e) => update("announcementEnabled", e.target.checked)}
                  className="accent-gold w-4 h-4"
                />
                <span className="text-sm">Enabled</span>
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Announcement Text"
                value={settings?.announcementText || ""}
                onChange={(e) => update("announcementText", e.target.value)}
              />
              <Input
                label="Link (optional)"
                value={settings?.announcementLink || ""}
                onChange={(e) => update("announcementLink", e.target.value)}
                placeholder="/shop"
              />
            </div>
          </Section>

          {/* Hero Section */}
          <Section title="Hero Section" desc="Main headline area on the landing page.">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Headline (line 1)"
                value={settings?.heroHeadline || ""}
                onChange={(e) => update("heroHeadline", e.target.value)}
              />
              <Input
                label="Headline (line 2 — gradient)"
                value={settings?.heroSubheadline || ""}
                onChange={(e) => update("heroSubheadline", e.target.value)}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={settings?.heroDescription || ""}
                  onChange={(e) => update("heroDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                />
              </div>
              <Input
                label="Button 1 Text"
                value={settings?.heroCta1Text || ""}
                onChange={(e) => update("heroCta1Text", e.target.value)}
              />
              <Input
                label="Button 1 Link"
                value={settings?.heroCta1Link || ""}
                onChange={(e) => update("heroCta1Link", e.target.value)}
              />
              <Input
                label="Button 2 Text"
                value={settings?.heroCta2Text || ""}
                onChange={(e) => update("heroCta2Text", e.target.value)}
              />
              <Input
                label="Button 2 Link"
                value={settings?.heroCta2Link || ""}
                onChange={(e) => update("heroCta2Link", e.target.value)}
              />
            </div>
          </Section>

          {/* Featured Card */}
          <Section title="Featured Card" desc="The large promotional card on the landing page.">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Tag / Subtitle"
                value={settings?.featuredSubtitle || ""}
                onChange={(e) => update("featuredSubtitle", e.target.value)}
              />
              <Input
                label="Title"
                value={settings?.featuredTitle || ""}
                onChange={(e) => update("featuredTitle", e.target.value)}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={settings?.featuredDescription || ""}
                  onChange={(e) => update("featuredDescription", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                />
              </div>
              <Input
                label="Image URL"
                value={settings?.featuredImage || ""}
                onChange={(e) => update("featuredImage", e.target.value)}
                placeholder="https://..."
              />
              <Input
                label="Link"
                value={settings?.featuredLink || ""}
                onChange={(e) => update("featuredLink", e.target.value)}
              />
            </div>
          </Section>

          {/* Payment Details */}
          <Section title="Payment Details" desc="Sent to customers via WhatsApp so they can pay. Shown when you click 'Send Bill'.">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="UPI ID"
                value={settings?.upiId || ""}
                onChange={(e) => update("upiId", e.target.value)}
                placeholder="yourname@okhdfcbank"
              />
              <Input
                label="Payment QR Image URL"
                value={settings?.paymentQrImage || ""}
                onChange={(e) => update("paymentQrImage", e.target.value)}
                placeholder="https://... (link to your QR image)"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Payment Note</label>
                <textarea
                  value={settings?.paymentNote || ""}
                  onChange={(e) => update("paymentNote", e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-md text-ivory focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                />
              </div>
            </div>
          </Section>

          {/* Category Images */}
          <Section title="Category Images" desc="Change the thumbnail images shown on the landing page. Click to upload or paste a URL.">
            <div className="space-y-4">
              {categories.map((cat, i) => (
                <div key={cat._id} className="flex items-center gap-4">
                  <div
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-sand/30 cursor-pointer group"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = async (e: any) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        toast.loading("Uploading...", { id: `cat-${cat._id}` });
                        try {
                          const res = await fetch("/api/upload", { method: "POST", body: formData });
                          const data = await res.json();
                          if (!data.success) throw new Error(data.error);
                          const updated = [...categories];
                          updated[i] = { ...updated[i], image: { url: data.data.url, publicId: data.data.publicId } };
                          setCategories(updated);
                          toast.success("Image uploaded!", { id: `cat-${cat._id}` });
                        } catch (err: any) {
                          toast.error(err.message || "Upload failed", { id: `cat-${cat._id}` });
                        }
                      };
                      input.click();
                    }}
                  >
                    {cat.image?.url && (
                      <Image src={cat.image.url} alt={cat.name} fill className="object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">Change</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">{cat.name}</p>
                    <input
                      value={cat.image?.url || ""}
                      onChange={(e) => {
                        const updated = [...categories];
                        updated[i] = { ...updated[i], image: { ...updated[i].image, url: e.target.value } };
                        setCategories(updated);
                      }}
                      placeholder="Or paste image URL here"
                      className="w-full px-3 py-1.5 bg-white border border-border rounded-md text-ivory text-xs focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold"
                    />
                  </div>
                </div>
              ))}
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  try {
                    for (const cat of categories) {
                      await fetch(`/api/categories/${cat._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ image: cat.image }),
                      });
                    }
                    toast.success("Category images saved!");
                  } catch {
                    toast.error("Failed to save categories");
                  }
                }}
              >
                Save Category Images
              </Button>
            </div>
          </Section>

          {/* Save */}
          <div className="flex justify-end pt-4 border-t border-border pb-20 md:pb-0">
            <Button onClick={handleSave} isLoading={saving}>
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 md:p-8">
      <h2 className="font-display text-xl text-ivory mb-1">{title}</h2>
      <p className="text-ivory/50 text-sm mb-5">{desc}</p>
      {children}
    </div>
  );
}
