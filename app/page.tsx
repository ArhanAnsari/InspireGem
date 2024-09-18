// app/page.tsx
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
        Welcome to InspireGem
      </h1>
      <p className="text-lg text-gray-700 max-w-lg mb-10">
        Leverage the power of AI with Google Gemini to create amazing content effortlessly.
      </p>
      <Link href="/plans">
        <p className="text-white bg-blue-600 hover:bg-blue-700 transition-all font-bold py-3 px-6 rounded-full shadow-lg">
          View Plans
        </p>
      </Link>
    </div>
  );
}
