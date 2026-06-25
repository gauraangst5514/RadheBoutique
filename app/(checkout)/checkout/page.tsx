"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
  notes: z.string().max(500).optional().or(z.literal("")),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const { items, getCartTotal, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg text-ivory flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal >= 499 ? 0 : 99;
  const total = subtotal + shipping;

  // Success animation screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg text-ivory flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-green-900/30 border-2 border-green-500 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                className="animate-[slide-up_0.4s_ease-out]"
              />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-gold mb-3">Order Received!</h1>
          <p className="text-ivory/70 mb-1">Your order number is</p>
          <p className="text-2xl font-bold text-gold mb-6 tracking-wide">{placedOrderNumber}</p>
          <p className="text-ivory/60 mb-8 text-sm">
            Thank you! We&apos;ll send your bill and payment QR to your WhatsApp shortly.
            Once we confirm your payment, your order will be dispatched.
          </p>
          {invoiceUrl && (
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold font-semibold hover:underline mb-8"
            >
              📄 Download Invoice
            </a>
          )}
          <div className="flex gap-3 justify-center flex-col sm:flex-row mt-2">
            <Button onClick={() => router.push("/shop")}>Continue Shopping</Button>
            <Button variant="secondary" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg text-ivory flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-3xl text-gold mb-4">Your Cart is Empty</h1>
          <p className="text-ivory/60 mb-8">Add items to your cart before checkout.</p>
          <Button onClick={() => router.push("/shop")}>Browse Products</Button>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          items: items.map((item) => ({
            productId: item.product,
            quantity: item.quantity,
            metal: item.metal,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to place order");
      }

      const { order, invoiceUrl } = data.data;

      clearCart();
      setPlacedOrderNumber(order.orderNumber);
      setInvoiceUrl(invoiceUrl || "");
      setIsSuccess(true);
      toast.success("Order received!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ivory py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl text-gold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          {/* Customer + Shipping details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="font-display text-xl text-gold mb-5">Delivery Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  {...register("customerName")}
                  error={errors.customerName?.message}
                />
                <Input
                  label="Phone Number *"
                  placeholder="10-digit mobile number"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Email (optional)"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Complete Shipping Address *"
                    placeholder="House no, street, area, landmark"
                    {...register("address")}
                    error={errors.address?.message}
                  />
                </div>
                <Input label="City *" {...register("city")} error={errors.city?.message} />
                <Input label="State *" {...register("state")} error={errors.state?.message} />
                <Input
                  label="Pincode *"
                  {...register("pincode")}
                  error={errors.pincode?.message}
                />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-ivory">
                    Notes (optional)
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    placeholder="Any special instructions for your order"
                    className="w-full px-4 py-2 bg-bg border border-border rounded-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                  />
                  {errors.notes && (
                    <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment note */}
            <div className="bg-gold/5 border border-gold/30 rounded-lg p-5 flex gap-3">
              <span className="text-2xl">💬</span>
              <div className="text-sm text-ivory/80">
                <p className="font-semibold text-gold mb-1">Pay After You Order</p>
                <p>
                  Place your order and we&apos;ll send your bill and payment QR to your WhatsApp.
                  Your order stays as <span className="text-gold">Pending</span> until payment is
                  confirmed — then we dispatch it right away.
                </p>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-lg p-6 sticky top-24">
              <h2 className="font-display text-xl text-gold mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.product}-${item.metal}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-ivory/80 pr-2">
                      {item.name} <span className="text-ivory/40">× {item.quantity}</span>
                    </span>
                    <span className="whitespace-nowrap">
                      {formatPrice((item.salePrice || item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-ivory/80">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ivory/80">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </Button>

              {subtotal < 499 && (
                <p className="text-xs text-ivory/50 text-center mt-3">
                  Add {formatPrice(499 - subtotal)} more for FREE shipping
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
