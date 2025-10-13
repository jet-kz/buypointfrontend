import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("Token")?.value;
  const role = req.cookies.get("Role")?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isHomePage = pathname === "/";

  const isAdminSection =
    pathname.startsWith("/admin") || pathname.startsWith("/superadmin");
  const isUserSection =
    pathname.startsWith("/user/cart") ||
    pathname.startsWith("/user/checkout") ||
    pathname.startsWith("/user/order") ||
    pathname.startsWith("/user/payment");

  // 1️⃣ Not logged in → block protected routes
  if (!token) {
    if (isAdminSection || isUserSection) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next(); // allow public pages
  }

  // 2️⃣ Admin or Superadmin → treat both as same
  if (role === "admin" || role === "superadmin") {
    // Redirect home ("/") → unified dashboard
    if (isHomePage || isLoginPage || isRegisterPage) {
      return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
    }
    // Block user-only routes
    if (isUserSection) {
      return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
    }
  }

  // 3️⃣ Normal User
  if (role === "user") {
    // Prevent access to admin/superadmin areas
    if (isAdminSection) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    // Prevent login/register again
    if (isLoginPage || isRegisterPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ✅ Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/user/:path*",
    "/admin/:path*",
    "/superadmin/:path*",
    "/login",
    "/register",
  ],
};
