import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = session.user as { name?: string | null; email?: string | null; role?: string; id?: string };

  return (
    <div className="min-h-screen bg-bg text-ivory">
      <div className="container mx-auto px-4 py-12">
        <h1 className="heading-1 text-gold mb-8">My Account</h1>

        <div className="bg-surface border border-border rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user.name || "User"}!</h2>
          <p className="text-ivory/60 mb-2">Email: {user.email}</p>
          <p className="text-ivory/60 mb-4">Role: {user.role || "user"}</p>
          
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="inline-block bg-gold text-bg px-6 py-2 rounded-sm hover:bg-gold/90 transition-colors"
            >
              Go to Admin Panel
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="bg-surface border border-border hover:border-gold rounded-lg p-6 transition-colors"
          >
            <h3 className="font-display text-2xl mb-2 text-gold">Orders</h3>
            <p className="text-ivory/60">View your order history</p>
          </Link>

          <Link
            href="/account/profile"
            className="bg-surface border border-border hover:border-gold rounded-lg p-6 transition-colors"
          >
            <h3 className="font-display text-2xl mb-2 text-gold">Profile</h3>
            <p className="text-ivory/60">Update your information</p>
          </Link>

          <Link
            href="/account/addresses"
            className="bg-surface border border-border hover:border-gold rounded-lg p-6 transition-colors"
          >
            <h3 className="font-display text-2xl mb-2 text-gold">Addresses</h3>
            <p className="text-ivory/60">Manage delivery addresses</p>
          </Link>

          <Link
            href="/wishlist"
            className="bg-surface border border-border hover:border-gold rounded-lg p-6 transition-colors"
          >
            <h3 className="font-display text-2xl mb-2 text-gold">Wishlist</h3>
            <p className="text-ivory/60">Your saved items</p>
          </Link>

          <Link
            href="/cart"
            className="bg-surface border border-border hover:border-gold rounded-lg p-6 transition-colors"
          >
            <h3 className="font-display text-2xl mb-2 text-gold">Cart</h3>
            <p className="text-ivory/60">View your shopping cart</p>
          </Link>

          <Link
            href="/shop"
            className="bg-surface border border-border hover:border-gold rounded-lg p-6 transition-colors"
          >
            <h3 className="font-display text-2xl mb-2 text-gold">Shop</h3>
            <p className="text-ivory/60">Continue shopping</p>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-gold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
