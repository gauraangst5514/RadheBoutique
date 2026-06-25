"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-bg text-ivory py-24 px-4">Loading...</div>;
  }

  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg text-ivory flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="heading-1 text-gold mb-4">Your Cart is Empty</h1>
          <p className="text-ivory/60 mb-8">Add some beautiful jewellery to your cart</p>
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
        <h1 className="heading-1 text-gold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product}-${item.metal}`}
                className="bg-surface border border-border rounded-lg p-4 flex gap-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-lg text-gold mb-1">{item.name}</h3>
                  <p className="text-sm text-ivory/60 mb-2 capitalize">Metal: {item.metal}</p>
                  <p className="text-lg font-semibold text-ivory">
                    {formatPrice(item.salePrice || item.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product, item.metal)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center gap-2 border border-border rounded">
                    <button
                      onClick={() => updateQuantity(item.product, item.metal, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gold hover:text-bg transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product, item.metal, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gold hover:text-bg transition-colors"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-lg p-6 sticky top-24">
              <h2 className="font-display text-2xl text-gold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-ivory/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-ivory/80">
                  <span>Shipping</span>
                  <span>{total >= 499 ? "FREE" : formatPrice(99)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-gold">
                      {formatPrice(total + (total >= 499 ? 0 : 99))}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full mb-3"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>

              <Link href="/shop">
                <Button variant="secondary" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              {total < 499 && (
                <p className="text-xs text-ivory/60 text-center mt-4">
                  Add {formatPrice(499 - total)} more for FREE shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
