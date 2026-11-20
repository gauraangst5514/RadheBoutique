import Link from "next/link";
import { isAdmin, usingDevPassword } from "@/lib/auth";
import { hasSupabase } from "@/lib/db";
import { LogoutButton } from "./LogoutButton";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isAdmin();
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-[960px] flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3">
          <Link href="/admin" className="font-display text-[24px] no-underline">RB ADMIN</Link>
          {signedIn && (
            <nav aria-label="Admin" className="no-scrollbar -mx-2 flex w-full gap-1 overflow-x-auto text-sm font-bold md:mx-0 md:ml-auto md:w-auto">
              <Link href="/admin" className="rounded-full px-3 py-2.5 no-underline hover:bg-blush">Orders</Link>
              <Link href="/admin/products" className="rounded-full px-3 py-2.5 no-underline hover:bg-blush">Products</Link>
              <Link href="/admin/restock" className="rounded-full px-3 py-2.5 no-underline hover:bg-blush">Restock</Link>
              <Link href="/" className="rounded-full px-3 py-2.5 no-underline hover:bg-blush">Site</Link>
              <LogoutButton />
            </nav>
          )}
        </div>
        {(!hasSupabase || usingDevPassword()) && (
          <p className="m-0 bg-[#FDEBD9] px-4 py-2 text-center text-xs font-bold text-[#7A3A06]">
            {!hasSupabase && "Demo mode: data is saved in a local file. Connect Supabase before going live. "}
            {usingDevPassword() && "Dev password is “admin”. Set ADMIN_PASSWORD before going live."}
          </p>
        )}
      </header>
      <div className="mx-auto max-w-[960px] px-4 pb-24 pt-5">{children}</div>
    </div>
  );
}
