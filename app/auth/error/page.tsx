// app/auth/error/page.tsx
"use client"; // Client-side component

import React from 'react';
import Link from 'next/link';

const ErrorPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="mb-6 text-2xl font-bold text-center text-red-500">Sign-In Error</h1>
        <p className="mb-4 text-center">Something went wrong during sign-in. Please try again.</p>
        <Link href="/auth/signin">
          <button className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Go back to Sign In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
