"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await signIn("google");
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-in failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Sign In</h1>
      <p className="mb-4">Sign in with your Google account.</p>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
