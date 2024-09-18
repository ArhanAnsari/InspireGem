// app/auth/error/page.tsx
"use client";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">Something went wrong during the authentication process.</p>
        <Link href="/auth/signin">
          <a className="text-white bg-blue-500 hover:bg-blue-600 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
            Go back to Sign In
          </a>
        </Link>
      </div>
    </div>
  );
}
