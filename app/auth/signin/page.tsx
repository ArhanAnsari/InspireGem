//app/auth/signin/page.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SignIn() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("OAuthAccountNotLinked")) {
          toast.info("This account is not linked. Please sign up first or sign in using the originally linked provider.");
        } else {
          toast.error("Sign-in failed. Please try again.");
          console.error("Sign-in error:", error.message);
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
        {/* Sign-in content */}
      </div>
      <ToastContainer position="top-right" />
    </>
  );
}
