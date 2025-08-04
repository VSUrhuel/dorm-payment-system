"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 1. Import useRouter
// Import the 'auth' instance from your central Firebase config file
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// --- THE MAIN REACT COMPONENT ---
export default function AuthPage() {
  const router = useRouter(); // 2. Initialize the router
  // State to hold the current user object from Firebase
  const [user, setUser] = useState(null);
  // State to toggle between Sign In and Sign Up forms
  const [isSignUp, setIsSignUp] = useState(false);
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State for loading indicators and error messages
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading true until first auth check

  // --- EFFECT FOR AUTH STATE CHANGES ---
  // This hook runs once on component mount to set up the Firebase auth listener.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Auth check is complete
    });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, []);

  // --- EFFECT FOR REDIRECTING ---
  // 3. This hook handles the redirect after a user logs in.
  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  // --- AUTH HANDLER FUNCTIONS ---

  const handleAuthAction = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged and the redirect effect will handle the rest.
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Note: A sign-out button wouldn't typically be on this page,
  // but the function is here if needed elsewhere.
  const handleSignOut = async () => {
    setError("");
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
    }
  };

  // --- RENDER LOGIC ---

  // 4. Show a loading state while checking auth or redirecting.
  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // If there's no user and loading is complete, show the login form.
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg transition-all">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h2>
          <p className="text-center text-gray-500 mb-8">
            {isSignUp
              ? "Fill in the details to get started"
              : "Sign in to continue"}
          </p>

          {error && (
            <div className="mb-4 text-center text-sm font-medium p-3 rounded-lg bg-red-100 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthAction}>
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
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
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
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-semibold transition-all ${
                isSignUp
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400`}
            >
              {loading
                ? "Processing..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-blue-600 hover:underline ml-1"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
