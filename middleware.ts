// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/signup", "/api/public-route"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("next-auth.session-token")?.value;

  // Allow public routes and static files to proceed without authentication
  if (publicRoutes.includes(pathname) || pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // Check if user is authenticated for private routes
  if (!token) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Handle special routes like webhooks (no token required)
  if (pathname.startsWith("/webhook")) {
    return NextResponse.next();
  }

  // Redirect authenticated users to the dashboard if accessing root
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|assets).*)"], // Match all routes except static files
};
