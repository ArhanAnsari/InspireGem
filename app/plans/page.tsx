import React from "react";
import Link from "next/link";

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Free Plan</h2>
          <p className="text-gray-600 mb-4">Up to 20 requests per month.</p>
          <p className="text-gray-600 mb-4">Basic AI content generation.</p>
          <p className="text-gray-600 mb-6">Community support.</p>
          <Link href="/api/checkout?plan=free">
            <a className="w-full block text-center text-white bg-blue-500 hover:bg-blue-600 font-bold py-2 rounded">
              Get Started
            </a>
          </Link>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Pro Plan</h2>
          <p className="text-gray-600 mb-4">200 requests per month.</p>
          <p className="text-gray-600 mb-4">Advanced AI content generation.</p>
          <p className="text-gray-600 mb-6">Priority email support.</p>
          <Link href="/api/checkout?plan=pro">
            <a className="w-full block text-center text-white bg-green-500 hover:bg-green-600 font-bold py-2 rounded">
              Subscribe for ₹499/month
            </a>
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Enterprise Plan</h2>
          <p className="text-gray-600 mb-4">Unlimited requests.</p>
          <p className="text-gray-600 mb-4">Access to all AI features.</p>
          <p className="text-gray-600 mb-6">24/7 premium support.</p>
          <Link href="/api/checkout?plan=enterprise">
            <a className="w-full block text-center text-white bg-red-500 hover:bg-red-600 font-bold py-2 rounded">
              Subscribe for ₹1,999/month
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
