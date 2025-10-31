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
    const url = role === "Admin" ? "/admin" : "/dormer";
    return NextResponse.redirect(new URL(url, request.url));
  }

  // Protect admin routes
  const allProtectedRoutes = [...adminRoutes, ...userRoutes];
  if (
    !isAuthenticated &&
    allProtectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated) {
    // If a 'User' tries to access an '/admin' route
    if (
      role === "User" &&
      adminRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL("/dormer", request.url));
    }

    // If an 'Admin' tries to access a '/user' route
    if (
      role === "Admin" &&
      userRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // 6. Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)"],
};
