import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/dashboard");
  const isProtected =
    isAdminRoute ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/account");

  if (pathname === "/login" && token) {
    if ((token as any)?.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && (token as any)?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/account",
    "/account/:path*",
  ],
};
