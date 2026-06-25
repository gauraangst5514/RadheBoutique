"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { IProduct } from "@/types";
import { formatPrice, calculateDiscount, getDisplayPrice } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const inWishlist = isInWishlist(product._id);
  const discount = calculateDiscount(product.price, product.salePrice);
  const displayPrice = getDisplayPrice(product.price, product.salePrice);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        price: product.price,
        salePrice: product.salePrice,
        inStock: product.stock > 0,
      });
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error("Product out of stock");
      return;
    }

    addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || "",
      price: product.price,
      salePrice: product.salePrice,
      quantity: 1,
      metal: product.metal,
      stock: product.stock,
    });
    toast.success("Added to cart");
  };

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative bg-surface border border-border rounded-lg overflow-hidden transition-all duration-300 hover:border-gold card-hover">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-surface">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-surface animate-pulse" />
          )}
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-500 ${
                isImageLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-gold text-bg text-xs font-bold px-2 py-1 rounded">
                Featured
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {discount}% OFF
              </span>
            )}
            {product.stock <= 0 && (
              <span className="bg-surface/90 text-ivory text-xs font-bold px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
              inWishlist
                ? "bg-gold text-bg"
                : "bg-surface/80 text-ivory hover:bg-gold hover:text-bg"
            }`}
          >
            <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
          </button>

          {/* Quick Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gold text-bg px-4 py-2 rounded-sm font-semibold flex items-center gap-2 text-sm"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-lg text-ivory mb-2 truncate group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-ivory/60 mb-3 truncate-2">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gold">
                {formatPrice(displayPrice)}
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <span className="text-sm text-ivory/40 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-ivory/60">
              <span>⭐</span>
              <span>{product.ratings.average.toFixed(1)}</span>
              <span>({product.ratings.count})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
