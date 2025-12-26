// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDocRef = adminDb.collection("dormers").doc(uid);
    const userDoc = await userDocRef.get();
    // Set session cookie with the Firebase token

    const userData = userDoc.data();
    const userRole = userData?.role; // e.g., "Admin" or "User"

    const response = NextResponse.json(
      { success: true, role: userRole },
      { status: 200 }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    };

    response.cookies.set("session", idToken, cookieOptions);
    response.cookies.set("session-role", userRole, cookieOptions); // <-- Store the role

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
