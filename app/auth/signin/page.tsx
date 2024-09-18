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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-teal-500 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">Sign In</h1>
        <p className="mb-4 text-gray-600">Sign in with your Google account.</p>
        <button
          onClick={handleSignIn}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-300"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
