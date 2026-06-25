import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Package, User, MapPin, Heart, ShoppingCart, Store, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  const user = session.user as { name?: string | null; email?: string | null; role?: string };

  const links = [
    { href: "/account/orders", label: "My Orders", desc: "View your order history", icon: Package },
    { href: "/wishlist", label: "Wishlist", desc: "Your saved items", icon: Heart },
    { href: "/cart", label: "Cart", desc: "View shopping cart", icon: ShoppingCart },
    { href: "/shop", label: "Shop", desc: "Continue shopping", icon: Store },
  ];

  return (
    <>
      <Navbar user={user} />
      <main className="min-h-screen bg-bg text-ivory">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-gold hover:underline text-sm mb-6">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* User info card */}
          <div className="bg-white border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <User className="text-gold" size={24} />
              </div>
              <div>
                <h1 className="font-display text-2xl text-ivory">{user.name || "User"}</h1>
                <p className="text-ivory/50 text-sm">{user.email}</p>
              </div>
            </div>
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="mt-4 inline-block bg-gold text-white px-5 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-gold/20 transition-all"
              >
                Open Admin Panel
              </Link>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 bg-white border border-border rounded-xl p-4 hover:border-gold/50 hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-sand/50 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <link.icon size={20} className="text-ivory/60 group-hover:text-gold transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ivory group-hover:text-gold transition-colors">{link.label}</p>
                  <p className="text-ivory/45 text-xs">{link.desc}</p>
                </div>
                <span className="text-ivory/30 group-hover:text-gold transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
