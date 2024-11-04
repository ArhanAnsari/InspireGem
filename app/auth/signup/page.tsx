//app/auth/signup/page.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SEO from "@/components/SEO";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SignUp() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Sign-up error:", error);
      toast.error("An unexpected error occurred during sign-up.");
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
      <SEO title="Sign Up - InspireGem" description="Sign up for InspireGem using your Google or GitHub account." />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
        <button onClick={() => handleSignUp("google")} disabled={loading} className="btn btn-primary">
          <FaGoogle className="mr-2" />
          {loading ? "Signing up..." : "Sign up with Google"}
        </button>
        <button onClick={() => handleSignUp("github")} disabled={loading} className="btn btn-secondary mt-4">
          <FaGithub className="mr-2" />
          {loading ? "Signing up..." : "Sign up with GitHub"}
        </button>
        <ToastContainer />
      </div>
    </>
  );
}
