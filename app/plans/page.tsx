"use client";

export default function PlansPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto p-6">
      {/* Free Plan */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Free Plan</h2>
        <p className="text-gray-600 mb-4">Up to 20 requests per month.</p>
        <p className="text-gray-600 mb-4">Basic AI content generation.</p>
        <p className="text-gray-600 mb-4">Community support.</p>
        <a href="/dashboard" className="text-white bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded-lg transition-colors">
          Get Started
        </a>
      </div>

      {/* Pro Plan */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Pro Plan</h2>
        <p className="text-gray-600 mb-4">200 requests per month.</p>
        <p className="text-gray-600 mb-4">Advanced AI content generation.</p>
        <p className="text-gray-600 mb-4">Priority email support.</p>
        <a href="/api/checkout?plan=pro" className="text-white bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded-lg transition-colors">
          Subscribe for ₹499/month
        </a>
      </div>

      {/* Enterprise Plan */}
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Enterprise Plan</h2>
        <p className="text-gray-600 mb-4">Unlimited requests.</p>
        <p className="text-gray-600 mb-4">Access to all AI features.</p>
        <p className="text-gray-600 mb-4">24/7 premium support.</p>
        <a href="/api/checkout?plan=enterprise" className="text-white bg-red-500 hover:bg-red-600 font-bold py-2 px-4 rounded-lg transition-colors">
          Subscribe for ₹1,999/month
        </a>
      </div>
    </div>
  );
}
