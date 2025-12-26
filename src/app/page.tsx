"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "../lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50">
      <header className="w-full h-[74px] bg-[#12372A] shadow-md flex items-center justify-between px-6 md:px-12 lg:px-24 animate-in fade-in duration-700">
        <div className="flex items-center gap-3">
          <img
            src="/profile.ico"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-lg"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              DormPay
            </h1>
          </div>
        </div>
        {/* <Button
          variant="outline"
          onClick={() => router.push("/login")}
          className="border-2 border-white text-[#12372A] hover:bg-white hover:text-[#12372A] transition-all"
          size="default"
        >
          Sign In
        </Button> */}
      </header>

      {/* Hero Section */}
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="flex flex-col items-center justify-between gap-8 md:gap-10 lg:gap-16 xl:gap-20 lg:grid lg:grid-cols-2">

            {/* Left Column - Text Content */}
            <div className="flex-1 w-full h-[115%] lg:max-w-2xl space-y-3 md:space-y-4 lg:space-y-5 order-2 lg:order-1 text-center lg:text-right relative">
              <div className="block lg:absolute lg:bottom-0 lg:left-15 mb-6 lg:mb-0 w-48 sm:w-56 md:w-64 mx-auto lg:mx-0 lg:w-112 xl:w-115 2xl:w-120 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
                <img
                  src="/landing-vector1.png"
                  alt="DormPay illustration"
                  className="w-full h-auto object-contain drop-shadow-lg"
                />
              </div>

              <div className="space-y-4 md:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#12372A] leading-[0.95] tracking-tight">
                  DormPay
                </h1>
                <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-[#12372A] rounded-full mx-auto lg:ml-auto lg:mr-0"></div>
              </div>  

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#12372A] leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                Your official portal for managing dorm payments.
              </p>
            </div>  

            {/* Right Column - Sign-in Card */}
            <div className="order-2 lg:order-2 w-full lg:w-auto flex justify-center items-start lg:flex-shrink-0">
              <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl shadow-2xl border border-gray-200 bg-white backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <CardHeader className="space-y-3">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-[#12372A] text-start">
                      Sign In
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5 px-6 pb-6">

                    {/* Role Selection */}
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-[#12372A]">
                        Select Account Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                        variant={selectedRole === "admin" ? "default" : "outline"}
                        onClick={() => setSelectedRole("admin")}
                        className={`h-11 font-medium transition-all ${selectedRole === "admin"
                          ? "bg-[#12372A] text-white hover:bg-[#1c4f3d] border-[#12372A] shadow-md"
                          : "border-[#12372A] text-[#12372A] hover:bg-[#12372A]/5"}`}
                          size={undefined}
                        >
                          Admin
                        </Button>
                        <Button
                        variant={selectedRole === "user" ? "default" : "outline"}
                        onClick={() => setSelectedRole("user")}
                        className={`h-11 font-medium transition-all ${selectedRole === "user"
                          ? "bg-[#12372A] text-white hover:bg-[#1c4f3d] border-[#12372A] shadow-md"
                          : "border-[#12372A] text-[#12372A] hover:bg-[#12372A]/5"}`}
                          size={undefined}
                        >
                          User
                        </Button>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                        {error}
                      </div>
                    )}
                    {message && (
                      <div className="p-3.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                        {message}
                      </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-5">
                      <div className="space-y-2.5">
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-[#12372A]"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12372A] focus:border-[#12372A] transition-all text-base"
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-[#12372A]"
                          >
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={handlePasswordReset}
                            className="text-sm font-medium text-[#12372A] hover:text-[#1c4f3d] hover:underline transition-all"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12372A] focus:border-[#12372A] transition-all text-base"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#12372A] transition-colors focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <Button
                      type="submit"
                      disabled={authActionLoading}
                      variant={undefined}
                      className="w-full bg-[#12372A] hover:bg-[#1c4f3d] text-white py-3.5 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#12372A] disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                      size="lg"
                      >
                        {authActionLoading
                          ? "Processing..."
                          : `Sign In as ${
                              selectedRole === "admin" ? "Admin" : "User"
                            }`}
                      </Button>
                    </form>

                    <p className="text-xs text-gray-500 text-center pt-2">
                      Developed by Laurente, J.R. & Dejos, P. | Department of Computer Science and Technology 2025
                    </p>
                  </CardContent>
                </Card>
            </div>
          </div>
      </main>
    </div>
  );
}
