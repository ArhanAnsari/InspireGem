import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gray-100 py-12">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Welcome to InspireGem</h1>
      <p className="text-gray-700 mb-8">
        Leverage the power of AI with Google Gemini to create amazing content effortlessly.
      </p>
      <Link href="/plans">
        <a className="text-white bg-blue-500 hover:bg-blue-600 font-bold py-3 px-6 rounded transition-colors">
          View Plans
        </a>
      </Link>
    </div>
  );
}
