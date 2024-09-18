"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await signIn("google");
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign-up failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Sign Up</h1>
      <p className="mb-4">Sign up with your Google account.</p>
      <button onClick={handleSignUp} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign up with Google
      </button>
    </div>
  );
}