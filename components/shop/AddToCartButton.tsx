"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { IProduct } from "@/types";

export default function AddToCartButton({ product }: { product: IProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
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
      quantity,
      metal: product.metal,
      stock: product.stock,
    });

    setAddedToCart(true);
    toast.success("Added to cart");
  };

  return (
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-5">
        <label className="text-[11px] tracking-[0.1em] uppercase text-ivory/50 font-medium">Qty</label>
        <div className="flex items-center border border-border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-2 text-ivory/50 hover:text-gold transition-colors text-sm"
          >
            −
          </button>
          <span className="px-4 py-2 border-x border-border text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-3 py-2 text-ivory/50 hover:text-gold transition-colors text-sm"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="mr-2" size={16} strokeWidth={1.5} />
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>

        {addedToCart && (
          <Link
            href="/cart"
            className="flex items-center gap-2 px-5 py-3 bg-ivory text-white text-[13px] font-medium tracking-wide transition-colors hover:bg-ivory/90"
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
