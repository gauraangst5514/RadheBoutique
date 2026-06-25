"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { IProduct } from "@/types";

export default function AddToCartButton({ product }: { product: IProduct }) {
  const [quantity, setQuantity] = useState(1);
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

    toast.success("Added to cart");
  };

  return (
    <div className="flex-1">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Quantity:</label>
        <div className="flex items-center border border-border rounded">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-gold hover:text-bg transition-colors"
          >
            −
          </button>
          <span className="px-6 py-2 border-x border-border">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-4 py-2 hover:bg-gold hover:text-bg transition-colors"
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
      >
        <ShoppingCart className="mr-2" size={20} />
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </Button>
    </div>
  );
}
