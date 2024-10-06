//app/dashboard/upgrade/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import getStripe from "@/lib/stripe-js"; // Ensure this utility is set up correctly
import SEO from "@/components/SEO"; // Importing SEO component
import { getUserData } from "@/firebaseFunctions"; // Import the function to fetch user data
import { useRouter } from "next/router"; // Import Next.js router for redirecting

const UpgradePage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<string>(""); // State to hold the user's current plan
  const router = useRouter(); // Router instance for redirecting

  useEffect(() => {
    // Fetch user data to get the current plan
    getUserData().then((userData) => {
      setCurrentPlan(userData.plan); // Assuming userData.plan contains the current plan
    });
  }, []);

  const getPriceFn = (plan: string) => {
    if (plan === "free") {
      // Redirect to dashboard if user selects the Free plan
      router.push("/dashboard");
      return;
    }

    fetch(`/api/checkout?plan=${plan}`)
      .then((data) => data.json())
      .then(async (body) => {
        const sessionId = body.sessionId;
        const stripe = await getStripe();
        await stripe?.redirectToCheckout({ sessionId });
      });
  };

  const isCurrentPlan = (plan: string) => currentPlan === plan; // Helper function to check if the user is on the current plan

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <SEO
        title="Upgrade Your Plan - InspireGem"
        description="Upgrade to a higher plan on InspireGem and unlock advanced AI content generation features."
      />
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Free Plan</h2>
          <p className="text-gray-600 mb-4">Up to 50 requests per month.</p>
          <p className="text-gray-600 mb-4">Basic AI content generation.</p>
          <p className="text-gray-600 mb-6">Community support.</p>
          <button
            type="button"
            className={`w-full text-center text-white ${
              isCurrentPlan("free") ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105`}
            onClick={() => getPriceFn("free")}
            disabled={isCurrentPlan("free")}
          >
            {isCurrentPlan("free") ? "You are on this plan" : "Continue with Free Plan"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Pro Plan</h2>
          <p className="text-gray-600 mb-4">500 requests per month.</p>
          <p className="text-gray-600 mb-4">Advanced AI content generation.</p>
          <p className="text-gray-600 mb-6">Priority email support.</p>
          <button
            type="button"
            className={`w-full text-center text-white ${
              isCurrentPlan("pro") ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105`}
            onClick={() => getPriceFn("pro")}
            disabled={isCurrentPlan("pro")}
          >
            {isCurrentPlan("pro") ? "You are on this plan" : "Upgrade to Pro - ₹499/month"}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Enterprise Plan</h2>
          <p className="text-gray-600 mb-4">Unlimited requests.</p>
          <p className="text-gray-600 mb-4">Access to all AI features.</p>
          <p className="text-gray-600 mb-6">24/7 premium support.</p>
          <button
            type="button"
            className={`w-full text-center text-white ${
              isCurrentPlan("enterprise") ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
            } font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105`}
            onClick={() => getPriceFn("enterprise")}
            disabled={isCurrentPlan("enterprise")}
          >
            {isCurrentPlan("enterprise") ? "You are on this plan" : "Upgrade to Enterprise - ₹1,999/month"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
