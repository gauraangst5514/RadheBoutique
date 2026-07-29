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
          <p className="text-gold/70 text-[11px] tracking-[0.3em] uppercase mb-3 font-medium">Your Cart</p>
          <h1 className="font-display text-3xl text-ivory mb-3">Nothing here yet</h1>
          <p className="text-ivory/40 text-sm mb-8">Add some beautiful pieces to get started.</p>
          <Link href="/shop">
            <Button>Browse Collection</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-ivory py-16 md:py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <p className="text-gold/70 text-[11px] tracking-[0.3em] uppercase mb-2 font-medium">Shopping</p>
        <h1 className="font-display text-3xl text-ivory mb-10">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product}-${item.metal}`}
                className="border-b border-border py-6 flex gap-5"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-sand/30 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-medium text-ivory mb-1 truncate">{item.name}</h3>
                  <p className="text-[12px] text-ivory/40 mb-2 capitalize">Metal: {item.metal}</p>
                  <p className="text-sm font-semibold text-ivory">
                    {formatPrice(item.salePrice || item.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.product, item.metal)}
                    className="text-ivory/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} strokeWidth={1.5} />
                  </button>

                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => updateQuantity(item.product, item.metal, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-ivory/50 hover:text-gold transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1.5 text-sm border-x border-border font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product, item.metal, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-ivory/50 hover:text-gold transition-colors"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border p-6 md:p-8 sticky top-24">
              <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-ivory/60 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-ivory/60">
                  <span>Subtotal</span>
                  <span className="text-ivory">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-ivory/60">
                  <span>Shipping</span>
                  <span className="text-ivory">{total >= 499 ? "Free" : formatPrice(99)}</span>
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-ivory">
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
                <p className="text-[11px] text-ivory/40 text-center mt-5">
                  Add {formatPrice(499 - total)} more for free shipping
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
