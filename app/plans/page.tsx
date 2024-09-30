"use client";
import getStripe from "@/lib/stripe-js";
import React from "react";
import SEO from "@/components/SEO"; // Import the SEO component

// Define the type for userPlan prop and make it optional
interface PlansPageProps {
  userPlan?: string; // Mark it as optional
}

export default function PlansPage({ userPlan = "free" }: PlansPageProps) { // Default to "free" if not provided
  const getPriceFn = (plan: string) => {
    fetch("/api/checkout?plan=" + plan)
      .then((data) => data.json())
      .then(async (body) => {
        const sessionId = body.sessionId;
        const stripe = await getStripe();
        await stripe?.redirectToCheckout({ sessionId });
      });
  };

  const isCurrentPlan = (plan: string) => userPlan === plan;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Add SEO Component */}
      <SEO
        title="Plans - InspireGem"
        description="Explore the available plans on InspireGem and choose the one that fits your content generation needs."
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div
          className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105 ${isCurrentPlan("free") ? "border-4 border-blue-600" : ""}`}
        >
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Free Plan</h2>
          <p className="text-gray-600 mb-4">Up to 50 requests per month.</p>
          <p className="text-gray-600 mb-4">Basic AI content generation.</p>
          <p className="text-gray-600 mb-6">Community support.</p>
          {isCurrentPlan("free") ? (
            <p className="text-green-600 font-bold">You are currently on this plan</p>
          ) : (
            <button
              type="button"
              className="w-full text-center text-white bg-blue-500 hover:bg-blue-600 font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105"
              onClick={() => getPriceFn("free")}
            >
              Get Started
            </button>
          )}
        </div>

        {/* Pro Plan */}
        <div
          className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105 ${isCurrentPlan("pro") ? "border-4 border-green-600" : ""}`}
        >
          <h2 className="text-3xl font-bold text-green-600 mb-4">Pro Plan</h2>
          <p className="text-gray-600 mb-4">500 requests per month.</p>
          <p className="text-gray-600 mb-4">Advanced AI content generation.</p>
          <p className="text-gray-600 mb-6">Priority email support.</p>
          {isCurrentPlan("pro") ? (
            <p className="text-green-600 font-bold">You are currently on this plan</p>
          ) : (
            <button
              type="button"
              className="w-full text-center text-white bg-green-500 hover:bg-green-600 font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105"
              onClick={() => getPriceFn("pro")}
            >
              Subscribe for ₹499/month
            </button>
          )}
        </div>

        {/* Enterprise Plan */}
        <div
          className={`bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105 ${isCurrentPlan("enterprise") ? "border-4 border-red-600" : ""}`}
        >
          <h2 className="text-3xl font-bold text-red-600 mb-4">Enterprise Plan</h2>
          <p className="text-gray-600 mb-4">Unlimited requests.</p>
          <p className="text-gray-600 mb-4">Access to all AI features.</p>
          <p className="text-gray-600 mb-6">24/7 premium support.</p>
          {isCurrentPlan("enterprise") ? (
            <p className="text-green-600 font-bold">You are currently on this plan</p>
          ) : (
            <button
              type="button"
              className="w-full text-center text-white bg-red-500 hover:bg-red-600 font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105"
              onClick={() => getPriceFn("enterprise")}
            >
              Subscribe for ₹1,999/month
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
