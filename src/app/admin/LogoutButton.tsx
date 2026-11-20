"use client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="cursor-pointer rounded-full border-0 bg-transparent px-3 py-2.5 text-sm font-bold text-ink hover:bg-blush"
    >
      Log out
    </button>
  );
}
