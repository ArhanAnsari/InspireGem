//app/auth/signin/page.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getUserData } from "@/firebaseFunctions";
import "react-toastify/dist/ReactToastify.css";
import SEO from "@/components/SEO";

export default function SignIn() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [showFallbackLink, setShowFallbackLink] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", { redirect: false });

      if (result?.error) {
        throw new Error(result.error);
      }

      const userEmail = session?.user?.email;

      if (userEmail) {
        const userData = await getUserData(userEmail);
        if (userData) {
          toast.success(`Welcome back! You are on the ${userData.plan} plan.`);
        }
      }

      router.push("/dashboard");
    } catch (error) {
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle automatic redirection
  useEffect(() => {
    if (session) {
      // Redirect after a short delay if session exists
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);

      // Show the fallback link if not redirected within 5 seconds
      const fallbackTimer = setTimeout(() => {
        setShowFallbackLink(true);
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearTimeout(fallbackTimer);
      };
    }
  }, [session, router]);

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
        {showFallbackLink && (
          <p className="mt-4 text-blue-500">
            Still don't get redirected to the dashboard?{" "}
            <a href="/dashboard" className="underline">
              Click here.
            </a>
          </p>
        )}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
}
