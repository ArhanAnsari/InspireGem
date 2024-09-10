// app/page.tsx
import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the AI-Powered Web App</h1>
      <p className="text-gray-600 mb-8">Leverage the power of AI with Google Gemini to create amazing content effortlessly.</p>
      <Link href="/plans">
        <a className="text-white bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded">
          View Plans
        </a>
      </Link>
    </div>
  );
};

export default HomePage;
