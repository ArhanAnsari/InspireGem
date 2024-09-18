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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-500 text-white">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">Sign Up</h1>
        <p className="mb-4 text-gray-600">Sign up with your Google account.</p>
        <button
          onClick={handleSignUp}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors duration-300"
        >
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
