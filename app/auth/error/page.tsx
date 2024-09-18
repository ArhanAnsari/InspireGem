// app/auth/error/page.tsx
"use client";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-gray-700 mb-6">Something went wrong during the authentication process.</p>
        <a href="/auth/signin" className="text-blue-500 hover:underline">Go back to Sign In</a>
      </div>
    </div>
  );
}
