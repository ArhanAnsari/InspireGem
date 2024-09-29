// app/about/page.tsx
import React from "react";
import Link from "next/link";
import SEO from "@/components/SEO"; // Import the SEO component

export default function AboutPage() {
  return (
    <>
      <SEO 
        title="About InspireGem - AI-Powered Content Generation Platform"
        description="Learn about InspireGem, an AI-powered content generation platform that helps you create high-quality content effortlessly using Google Gemini."
      />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            About <span className="text-blue-600">InspireGem</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            InspireGem is an AI-powered content generation platform built to help
            you create high-quality content effortlessly. Using the power of
            Google Gemini, InspireGem can generate articles, blog posts, and other
            creative writing, saving you time and effort.
          </p>

          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Key Features
            </h2>
            <ul className="text-left space-y-4 text-gray-600">
              <li>
                <strong>AI-Powered Content Creation:</strong> Leverage Google
                Gemini&apos;s capabilities to generate accurate, creative content
                effortlessly.
              </li>
              <li>
                <strong>Markdown Support:</strong> Format your generated content
                using Markdown for seamless integration into blogs, websites, and
                other platforms.
              </li>
              <li>
                <strong>Plan-Based Usage Limits:</strong> Select from a variety of
                plans that match your content generation needs, ranging from free
                to enterprise-level usage.
              </li>
              <li>
                <strong>Responsive Design:</strong> Enjoy a fully responsive
                interface optimized for both desktop and mobile devices, powered
                by Tailwind CSS.
              </li>
              <li>
                <strong>Google Authentication:</strong> Sign in easily and
                securely using your Google account.
              </li>
              <li>
                <strong>History &amp; Reuse:</strong> View and reuse previously
                generated content.
              </li>
            </ul>
          </div>

          <div className="mt-10">
            <Link href="/plans" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
