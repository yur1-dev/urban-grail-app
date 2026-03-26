import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });

  const { pathname } = req.nextUrl;
  const role = (token as any)?.role;

  const isAdminRoute = pathname.startsWith("/dashboard");
  const isRiderRoute = pathname.startsWith("/rider");
  const isProtected =
    isAdminRoute ||
    isRiderRoute ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/account");

  if (pathname === "/login" && token) {
    if (role === "admin")
      return NextResponse.redirect(new URL("/dashboard", req.url));
    if (role === "rider")
      return NextResponse.redirect(new URL("/rider", req.url));
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isRiderRoute && role !== "rider" && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/rider/:path*",
    "/rider",
    "/checkout/:path*",
    "/account",
    "/account/:path*",
  ],
};
