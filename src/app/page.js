"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "./../lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail, // 1. Import for password reset
} from "firebase/auth";
import { Building2 } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages like password reset
  const [loading, setLoading] = useState(false);
  const [authActionLoading, setAuthActionLoading] = useState(false);

  // Handler for the sign-in form submission
  const handleSignIn = async (event) => {
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

      router.push("/admin");
    } catch (err) {
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
      setLoading(false); // Ensure loading is false after the attempt
    }
  };

  // 2. Handler for the "Forgot Password" action
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
      setLoading(false); // Ensure loading is false after the attempt
    }
  };

  // 3. Improved loading/redirecting state
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
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
              <img src="/profile.ico" alt="Logo" width={62} height={62} />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Welcome to DormPay
            </h2>
            <p className="text-center text-gray-500 mt-1">Admin Sign In</p>
          </div>

          {error && (
            <div className="mb-4 text-center text-sm font-medium p-3 rounded-lg bg-red-100 text-red-700">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 text-center text-sm font-medium p-3 rounded-lg bg-green-100 text-green-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                {/* 4. Forgot Password Button */}
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              onClick={handlePasswordReset}
              className="text-sm font-medium text-blue-600 hover:underline flex items-end justify-end mb-4 w-full"
            >
              Forgot Password?
            </button>
            <button
              type="submit"
              disabled={authActionLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {authActionLoading ? "Processing..." : "Sign In"}
            </button>
          </form>

          <p className="mt-3 text-xs text-gray-400 text-center ">
            Developed by Laurente, J.R. | Mabolo 2025
          </p>
        </div>
      </div>
    </div>
  );
}
