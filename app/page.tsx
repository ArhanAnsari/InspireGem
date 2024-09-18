// app/page.tsx
import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to the InspireGem
      </h1>
      <p className="text-gray-600 mb-8">
        Leverage the power of AI with Google Gemini to create amazing content
        effortlessly.
      </p>
      <Link href="/plans">
        <p className="text-white bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded">
          View Plans
        </p>
      </Link>
    </div>
  );
}

//export default HomePage;
