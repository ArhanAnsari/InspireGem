// app/auth/error/page.tsx
'use client'; // This is a client component

import React from 'react';

const AuthErrorPage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Authentication Error</h1>
      <p>There was an issue with your sign-in. Please try again.</p>
    </div>
  );
};

export default AuthErrorPage;
