"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./../lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [authActionLoading, setAuthActionLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "user">("user");

  // Handler for the sign-in form submission
  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setAuthActionLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const idToken = await user.getIdToken();

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to log in on the server.");
      }

      // Redirect based on selected role
      if (selectedRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/dormer");
      }
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format. Please check and try again.");
          break;
        case "auth/too-many-requests":
          setError(
            "Too many failed attempts. Please try again later or reset your password."
          );
          break;
        case "auth/network-request-failed":
          setError(
            "Network error. Please check your connection and try again."
          );
          break;
        case "auth/user-disabled":
          setError("This user account has been disabled.");
          break;
        default:
          setError("Failed to sign in. Please check your credentials.");
      }
    } finally {
      setAuthActionLoading(false);
      setLoading(false);
    }
  };

  // Handler for the "Forgot Password" action
  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setError("");
    setMessage("");
    setAuthActionLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err) {
      setError(
        "Failed to send reset email. Please check the address and try again."
      );
    } finally {
      setAuthActionLoading(false);
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-600">
        <img
          src="/profile.ico"
          alt="Logo"
          width={32}
          height={32}
          className="animate-pulse"
        />
        <p className="mt-4 text-lg">Connecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/profile.ico"
              alt="DormPay Logo"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-2xl">DormPay</CardTitle>
          <CardDescription className={undefined}>
            Payment System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedRole === "admin" ? "default" : "outline"}
                onClick={() => setSelectedRole("admin")}
                className={
                  selectedRole === "admin"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
                size={undefined}
              >
                Admin
              </Button>
              <Button
                variant={selectedRole === "user" ? "default" : "outline"}
                onClick={() => setSelectedRole("user")}
                className={
                  selectedRole === "user"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
                size={undefined}
              >
                User
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={authActionLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
              size="lg"
              variant={undefined}
            >
              {authActionLoading
                ? "Processing..."
                : `Sign In as ${selectedRole === "admin" ? "Admin" : "User"}`}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
            Developed by Laurente, J.R. | Mabolo 2025
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
