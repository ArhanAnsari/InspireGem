import React from "react";
import Link from "next/link";

export default function PlansPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Free Plan</h2>
          <p className="text-gray-600 mb-6">Up to 20 requests per month.</p>
          <p className="text-gray-600 mb-6">Basic AI content generation.</p>
          <p className="text-gray-600 mb-6">Community support.</p>
          <Link href="/api/checkout?plan=free">
            <a className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
              Get Started
            </a>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-blue-500">
          <h2 className="text-2xl font-semibold mb-4">Pro Plan</h2>
          <p className="text-gray-600 mb-6">200 requests per month.</p>
          <p className="text-gray-600 mb-6">Advanced AI content generation.</p>
          <p className="text-gray-600 mb-6">Priority email support.</p>
          <Link href="/api/checkout?plan=pro">
            <a className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
              Subscribe for ₹499/month
            </a>
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">Enterprise Plan</h2>
          <p className="text-gray-600 mb-6">Unlimited requests.</p>
          <p className="text-gray-600 mb-6">Access to all AI features.</p>
          <p className="text-gray-600 mb-6">24/7 premium support.</p>
          <Link href="/api/checkout?plan=enterprise">
            <a className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">
              Subscribe for ₹1,999/month
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
