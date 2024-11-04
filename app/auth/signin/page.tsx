//app/auth/signin/page.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SEO from "@/components/SEO";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SignIn() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam && errorParam === "OAuthAccountNotLinked") {
      toast.error("Please sign in using your existing linked provider.");
      setError(errorParam);
    }
  }, []);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (err) {
      console.error("Sign-in error:", err);
      toast.error("An unexpected error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <>
      <SEO title="Sign In - InspireGem" description="Sign in to InspireGem using your Google or GitHub account." />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Sign In</h1>
        <button onClick={() => handleSignIn("google")} disabled={loading} className="btn btn-primary">
          <FaGoogle className="mr-2" />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        <button onClick={() => handleSignIn("github")} disabled={loading} className="btn btn-secondary mt-4">
          <FaGithub className="mr-2" />
          {loading ? "Signing in..." : "Sign in with GitHub"}
        </button>
        <ToastContainer />
      </div>
    </>
  );
}
