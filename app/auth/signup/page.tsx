//app/auth/signup/page.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      if (error instanceof Error) {
        if (error.message.includes("OAuthAccountNotLinked")) {
          toast.error("Sign-up failed. Please try again or sign in with your existing account.");
        } else {
          toast.error("Sign-up failed. Please try again.");
          console.error("Sign-up error:", error.message);
        }
      }
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Sign-up content */}
      </div>
      <ToastContainer position="top-right" />
    </>
  );
}
