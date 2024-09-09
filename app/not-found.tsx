// app/not-found.tsx
'use client'; // This is a client component

import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFoundPage;
