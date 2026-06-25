"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search as SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim().length >= 2) {
        setLoading(true);
        fetch(`/api/products?search=${encodeURIComponent(query.trim())}&limit=20`)
          .then((r) => r.json())
          .then((d) => {
            setResults(d.success ? d.data : []);
            setSearched(true);
          })
          .catch(() => setResults([]))
          .finally(() => setLoading(false));
      } else {
        setResults([]);
        setSearched(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(p);

  return (
    <>
      <Navbar user={null} />
      <main className="min-h-screen bg-bg text-ivory">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Search input */}
          <div className="relative mb-8">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for jewellery..."
              autoFocus
              className="w-full pl-12 pr-4 py-4 bg-white border border-border rounded-xl text-ivory text-lg placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="spinner" />
              </div>
            )}
          </div>

          {/* Results */}
          {!searched && !loading && (
            <div className="text-center text-ivory/40 py-12">
              <SearchIcon size={48} className="mx-auto mb-4 opacity-30" />
              <p>Start typing to search products</p>
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="text-center text-ivory/50 py-12">
              <p className="text-lg mb-2">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm">Try a different keyword</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-ivory/50 text-sm mb-4">{results.length} result{results.length > 1 ? "s" : ""}</p>
              {results.map((product: any) => (
                <Link
                  key={product._id}
                  href={`/shop/${product.slug}`}
                  className="flex items-center gap-4 bg-white border border-border rounded-xl p-3 hover:border-gold/50 hover:shadow-sm transition-all group"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-sand/30">
                    {product.images?.[0] && (
                      <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ivory group-hover:text-gold transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="text-ivory/45 text-xs truncate">{product.shortDescription}</p>
                  </div>
                  <span className="text-gold font-semibold text-sm whitespace-nowrap">
                    {formatPrice(product.salePrice || product.price)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
