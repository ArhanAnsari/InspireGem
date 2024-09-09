// app/auth/signin/page.tsx
'use client'; // This is a client component

import React from 'react';
import ToastNotification from '../../components/ToastNotification'; // Update path if necessary

const SignInPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Sign In</h1>
      <p className="text-gray-600 mb-8">Sign in with your Google account.</p>
      {/* Add your Google Sign-In Button here */}
      <ToastNotification />
    </div>
  );
};

export default SignInPage;
