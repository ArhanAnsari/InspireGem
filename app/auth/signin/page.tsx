"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SEO from "@/components/SEO";
import { getUserData } from "@/firebaseFunctions";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Wait for session to be available
      const userEmail = result?.user?.email;
      if (userEmail) {
        const userData = await getUserData(userEmail);
        if (userData) {
          toast.success(`Welcome back! You are on the ${userData.plan} plan.`);
        }
      }

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign In - InspireGem"
        description="Sign in to InspireGem using your Google account to access AI-powered content generation."
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 py-6 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Sign In</h1>
        <p className="text-base sm:text-lg mb-4">Sign in with your Google account.</p>
        <button
          onClick={handleSignIn}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50" : "hover:bg-blue-600"}`}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
}
