"use client";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Error</h1>
      <p className="text-gray-600 mb-8">Something went wrong during the authentication process.</p>
      <Link href="/auth/signin" className="text-blue-500 underline">
        Go back to Sign In
      </Link>
    </div>
  );
}
