// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/auth/signin", "/auth/signup", "/api/public-route", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("next-auth.session-token")?.value;

  // Allow public routes and assets to pass through
  if (publicRoutes.includes(pathname) || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // Redirect authenticated users to /dashboard when they access /
  if (pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to /auth/signin when accessing protected routes
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|assets).*)"],
};
