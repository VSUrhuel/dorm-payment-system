// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const adminRoutes = [
  "/admin",
  "/admin/dormers",
  "/admin/events",
  "/admin/expenses",
  "/admin/payments",
];
const vsuAdminRoutes = [
  "/vsu-admin",
  "/vsu-admin/dormitories",
  "/vsu-admin/advisers",
];
const userRoutes = [
  "/user",
  "/user/payment",
  // Add other user-specific pages here, e.g., "/user/profile"
];

const publicRoutes = ["/"];

const staticRoutes = [
  "/api/auth",
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/public",
];

async function verifyFirebaseToken(idToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      }
    );

    const data = await response.json();
    return !!data.users && data.users.length > 0;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static routes
  if (staticRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;
  const role = request.cookies.get("session-role")?.value;

  let isAuthenticated = false;
  if (token) {
    isAuthenticated = await verifyFirebaseToken(token);
  }

  // Redirect authenticated users away from public routes
  if (isAuthenticated && publicRoutes.includes(pathname)) {
    const url = 
      (role === "Admin" || role === "Adviser") ? "/admin" : 
      role === "VSUAdmin" ? "/vsu-admin" : 
      "/dormer";
    return NextResponse.redirect(new URL(url, request.url));
  }

  // Protect routes
  const userProtectedRoutes = [...userRoutes, "/dormer"];
  const allProtectedRoutes = [...adminRoutes, ...vsuAdminRoutes, ...userProtectedRoutes];
  
  if (
    !isAuthenticated &&
    allProtectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated) {
    const isAdmin = role === "Admin" || role === "Adviser";
    const isVSUAdmin = role === "VSUAdmin";
    const isUser = role === "User";

    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
    const isVSUAdminRoute = vsuAdminRoutes.some((route) => pathname.startsWith(route));
    const isUserRoute = userProtectedRoutes.some((route) => pathname.startsWith(route));

    // Admin/Adviser access control: Only allow adminRoutes
    if (isAdmin && (isVSUAdminRoute || isUserRoute)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // VSUAdmin access control: Only allow vsuAdminRoutes
    if (isVSUAdmin && (isAdminRoute || isUserRoute)) {
      return NextResponse.redirect(new URL("/vsu-admin", request.url));
    }

    // User access control: Only allow userRoutes
    if (isUser && (isAdminRoute || isVSUAdminRoute)) {
      return NextResponse.redirect(new URL("/dormer", request.url));
    }
  }

  // 6. Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
