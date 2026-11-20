import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Simple shared-password login for the family. One password (ADMIN_PASSWORD) unlocks /admin
 * on any phone for 30 days. The cookie is signed, so it can't be forged without ADMIN_SECRET.
 */
const COOKIE = "rb_admin";
const DAYS = 30;

function password() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "production" ? null : "admin"; // dev only
}
function secret() {
  return process.env.ADMIN_SECRET || password() || "";
}
function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function adminConfigured() {
  return password() !== null;
}

export function checkPassword(input: string) {
  const pw = password();
  if (!pw) return false;
  const a = Buffer.from(sign(input));
  const b = Buffer.from(sign(pw));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function startSession() {
  const exp = Date.now() + DAYS * 864e5;
  const value = `${exp}.${sign(`admin.${exp}`)}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DAYS * 86400,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const raw = (await cookies()).get(COOKIE)?.value; // read cookies first so pages always render per request
  if (!adminConfigured()) return false;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const expected = Buffer.from(sign(`admin.${exp}`));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function requireAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function usingDevPassword() {
  return !process.env.ADMIN_PASSWORD && process.env.NODE_ENV !== "production";
}
