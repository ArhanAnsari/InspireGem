// app/auth/signin/page.tsx
"use client";
import { signIn } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    try {
      const res = await signIn("google", { callbackUrl: "/dashboard" });
      if (res?.error) {
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign in with Google</h1>
      <button
        onClick={handleGoogleSignIn}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        Sign In with Google
      </button>
      <ToastContainer />
    </div>
  );
}
