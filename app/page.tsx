import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-white">
      <h1 className="text-5xl font-extrabold mb-6 text-center">Welcome to InspireGem</h1>
      <p className="text-lg mb-8 max-w-lg text-center">
        Leverage the power of AI with Google Gemini to create amazing content effortlessly.
      </p>
      <Link href="/plans">
        <a className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all">
          View Plans
        </a>
      </Link>
    </div>
  );
};

export default HomePage;
