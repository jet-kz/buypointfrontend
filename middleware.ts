import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("Token")?.value;
  const role = req.cookies.get("Role")?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isHomePage = pathname === "/";

  const isSuperAdminRoute = pathname.startsWith("/superadmin");
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute =
    pathname.startsWith("/user/cart") ||
    pathname.startsWith("/user/checkout") ||
    pathname.startsWith("/user/order") ||
    pathname.startsWith("/user/payment");

  // 1️⃣ Not logged in → block protected routes
  if (!token) {
    if (isSuperAdminRoute || isAdminRoute || isUserRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next(); // allow public pages
  }

  // 2️⃣ Role-based access control
  if (role === "superadmin") {
    // Redirect home ("/") → superadmin dashboard
    if (isHomePage) {
      return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
    }
    // Block other role pages
    if (isAdminRoute || isUserRoute) {
      return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
    }
  } else if (role === "admin") {
    // Redirect home ("/") → admin dashboard
    if (isHomePage) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    if (isSuperAdminRoute || isUserRoute) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  } else {
    // Normal user — home is `/`
    if (isSuperAdminRoute || isAdminRoute) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 3️⃣ Block login/register if already logged in
  if (isLoginPage || isRegisterPage) {
    if (role === "superadmin") {
      return NextResponse.redirect(new URL("/superadmin/dashboard", req.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    // Normal user → just home
    return NextResponse.redirect(new URL("/", req.url));
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
