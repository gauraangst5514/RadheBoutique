"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mx-auto mt-10 flex max-w-[360px] flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr(null);
        const r = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
        setBusy(false);
        if (r.ok) {
          router.push("/admin");
          router.refresh();
        } else setErr("Wrong password");
      }}
    >
      <h1 className="font-display m-0 text-[40px] leading-none">SHOP LOGIN</h1>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-bold">Password</span>
        <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} className="min-h-12 rounded-xl border border-[#D9B8C4] bg-white px-3.5 text-base" required />
      </label>
      {err && <p role="alert" className="m-0 font-bold text-bad">{err}</p>}
      <button disabled={busy} className="min-h-[52px] cursor-pointer rounded-full border-0 bg-pink text-base font-bold text-white disabled:opacity-60">
        {busy ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
