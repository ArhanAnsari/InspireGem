/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getUserData } from "@/firebaseFunctions"; // Import Firebase function to get user data
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn("google");
      if (result?.error) {
        throw new Error(result.error);
      }

      // Fetch user data after sign-in
      const user = result?.user;
      if (user && user.email) {
        const userData = await getUserData(user.email);
        if (userData) {
          console.log(`User Plan: ${userData.plan}`);
          console.log(`Max Requests Allowed: ${userData.requestCount}`);
          console.log(`Requests Made: ${userData.requestCount}`);

          // Optionally show a toast with this information
          toast.success(`Welcome back! You are on the ${userData.plan} plan.`);
        }
      }

      router.push("/dashboard");
    } catch (error) {
      toast.error("Sign-in failed. Please try again.");
      console.error("Sign-in failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-8">Sign In</h1>
      <p className="mb-4">Sign in with your Google account.</p>
      <button
        onClick={handleSignIn}
        className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50" : "hover:bg-blue-600"}`}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
