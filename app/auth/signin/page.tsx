//app/auth/signin/page.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getUserData } from "@/firebaseFunctions";
import "react-toastify/dist/ReactToastify.css";
import SEO from "@/components/SEO";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SignIn() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [showFallbackLink, setShowFallbackLink] = useState(false);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    try {
      const result = await signIn(provider, { redirect: false });

      if (result?.error) {
        if (result.error === "OAuthAccountNotLinked") {
          toast.info("Account not linked. Redirecting to sign-up.");
          router.push("/auth/signup");
          return;
        }
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

  useEffect(() => {
    if (session) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
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
      <SEO title="Sign In - InspireGem" description="Sign in to InspireGem using your Google or GitHub account." />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 py-6 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Sign In</h1>
        <p className="text-base sm:text-lg mb-4">Sign in with one of the options below.</p>
        <button
          onClick={() => handleSignIn("google")}
          className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 ${loading ? "opacity-50" : "hover:bg-blue-600"}`}
          disabled={loading}
        >
          <FaGoogle /> {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        <button
          onClick={() => handleSignIn("github")}
          className={`bg-gray-800 text-white px-4 py-2 mt-4 rounded flex items-center gap-2 ${loading ? "opacity-50" : "hover:bg-gray-900"}`}
          disabled={loading}
        >
          <FaGithub /> {loading ? "Signing in..." : "Sign in with GitHub"}
        </button>
        {showFallbackLink && (
          <p className="mt-4 text-blue-500">
            Still don&apos;t get redirected to the dashboard?{" "}
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
