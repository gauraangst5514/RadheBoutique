"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (item: any) => {
    if (!item.inStock) {
      toast.error("Product out of stock");
      return;
    }

    addToCart({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      salePrice: item.salePrice,
      quantity: 1,
      metal: "gold",
      stock: 10,
    });
    
    toast.success("Added to cart");
  };

  if (!mounted) {
    return <div className="min-h-screen bg-bg text-ivory py-24 px-4">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg text-ivory flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="heading-1 text-gold mb-4">Your Wishlist is Empty</h1>
          <p className="text-ivory/60 mb-8">Save your favorite items for later</p>
          <Link href="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ivory py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="heading-1 text-gold mb-8">My Wishlist</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.product} className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="relative aspect-square">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
                <button
                  onClick={() => {
                    removeItem(item.product);
                    toast.success("Removed from wishlist");
                  }}
                  className="absolute top-3 right-3 bg-surface/90 p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg text-gold mb-2">{item.name}</h3>
                <p className="text-xl font-bold text-ivory mb-3">
                  {formatPrice(item.salePrice || item.price)}
                </p>
                <Button
                  className="w-full text-sm"
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.inStock}
                >
                  <ShoppingCart size={16} className="mr-2" />
                  {item.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
