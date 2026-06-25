"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { IProduct } from "@/types";

export default function WishlistButton({ product }: { product: IProduct }) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product._id);

  const handleToggle = () => {
    if (inWishlist) {
      removeItem(product._id);
      toast.success("Removed from wishlist");
    } else {
      addItem({
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

  return (
    <Button
      variant={inWishlist ? "primary" : "secondary"}
      onClick={handleToggle}
      className="px-6"
    >
      <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
    </Button>
  );
}
