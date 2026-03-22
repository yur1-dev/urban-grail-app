import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/dashboard");
  const isProtected =
    isAdminRoute ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/account");

  if (pathname === "/login" && session) {
    if ((session.user as any)?.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAdminRoute && (session?.user as any)?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/checkout/:path*",
    "/account/:path*",
  ],
};
