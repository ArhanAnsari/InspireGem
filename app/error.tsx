// app/error.tsx
"use client";

import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p>Please try again later or contact support.</p>
    </div>
  );
};

export default ErrorPage;
