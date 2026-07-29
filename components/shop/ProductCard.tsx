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
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-sand/30 mb-3">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-sand/40 animate-pulse" />
        )}
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 ease-out ${
              isImageLoaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-ivory text-white text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase">
              {discount}% Off
            </span>
          )}
          {product.stock <= 0 && (
            <span className="bg-white/90 text-ivory text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all ${
            inWishlist
              ? "text-gold"
              : "text-ivory/40 hover:text-gold opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart size={18} fill={inWishlist ? "currentColor" : "none"} strokeWidth={1.5} />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-ivory/95 text-white py-3 text-[11px] tracking-[0.1em] uppercase font-medium flex items-center justify-center gap-2 hover:bg-ivory transition-colors"
          >
            <ShoppingCart size={14} strokeWidth={1.5} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-[13px] text-ivory/75 mb-1 truncate group-hover:text-gold transition-colors leading-tight">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-ivory">
            {formatPrice(displayPrice)}
          </span>
          {product.salePrice && product.salePrice < product.price && (
            <span className="text-xs text-ivory/35 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
