import React from "react";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";
import SEO from "@/components/SEO"; // Import the SEO component

export default function HomePage() {
  return (
    <>
      <SEO
        title="InspireGem - AI-Powered Content Generation Platform"
        description="Welcome to InspireGem, an AI-powered platform that helps you create amazing content effortlessly using Google Gemini. Explore our plans and get started today."
      />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
            Welcome to <span className="text-blue-600">InspireGem</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Leverage the power of AI with Google Gemini to create amazing content effortlessly. Whether you need help generating stories, articles, or creative ideas, InspireGem is here to assist you.
          </p>
          <Link
            href="/plans"
            className="inline-block bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            View Plans
          </Link>
        </div>

        {/* Additional Links for Navigation */}
        <div className="mt-10 space-x-4">
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
          <Link href="/about" className="text-blue-600 hover:underline">
            Learn More About InspireGem
          </Link>
        </div>

        {/* Star us on GitHub Button */}
        <div className="mt-8">
          <a
            href="https://github.com/ArhanAnsari/InspireGem"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-900 transition-transform transform hover:scale-105"
          >
            <StarIcon className="w-5 h-5 mr-2 text-yellow-400" />
            Star us on GitHub
          </a>
        </div>
      </div>
    </>
  );
}
