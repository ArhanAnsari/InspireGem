// app/auth/signin/page.tsx
"use client"; // Client-side component

import React from 'react';
import { signIn } from 'next-auth/react';
import { notify } from '../../../components/ToastNotification';

const SignInPage: React.FC = () => {
  const handleGoogleSignIn = () => {
    signIn('google').catch(() => notify('Failed to sign in with Google', 'error'));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="mb-6 text-2xl font-bold text-center">Sign In</h1>
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
