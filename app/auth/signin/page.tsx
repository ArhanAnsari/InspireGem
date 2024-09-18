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
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-500 mb-4">Sign In</h1>
        <p className="text-gray-700 mb-6">Sign in with your Google account.</p>
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
