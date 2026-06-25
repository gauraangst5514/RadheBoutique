import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const isAdmin = token?.role === "admin";

  if (pathname.startsWith("/account")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", request.url));
    if (!isAdmin) return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/login", "/register"],
};
