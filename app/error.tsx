// app/error.tsx
'use client'; // This is a client component

import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">An Error Occurred</h1>
      <p>Sorry, something went wrong. Please try again later.</p>
    </div>
  );
};

export default ErrorPage;
