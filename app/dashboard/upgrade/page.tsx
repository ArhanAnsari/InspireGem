//app/dashboard/upgrade/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import getStripe from "@/lib/stripe-js"; // Ensure this utility is set up correctly
import SEO from "@/components/SEO"; // Importing SEO component
import { getUserData } from "@/firebaseFunctions"; // Import the function to fetch user data
import { useSession } from "next-auth/react"; // For session management
import { useRouter } from "next/navigation"; // Import Next.js router for redirecting
import Tooltip from "@/components/Tooltip"; // Tooltip component for fun tooltips
import PlanBadge from "@/components/PlanBadge"; // Plan Badge component for progressive badges
import CountdownTimer from "@/components/CountdownTimer"; // Countdown Timer for time-sensitive offers
import PlanChart from "@/components/PlanChart"; // Chart to visualize plan benefits

const UpgradePage: React.FC = () => {
  const [userPlan, setUserPlan] = useState<string>("free"); // State to hold the user's current plan
  const { data: session, status } = useSession(); // Get session from NextAuth
  const router = useRouter(); // Router instance for redirecting

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (session?.user?.email) {
        try {
          const userData = await getUserData(session.user.email);
          if (userData) {
            setUserPlan(userData.plan); // Update the state with the user's plan
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (session) {
      fetchUserPlan();
    }
  }, [session]);

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

  const isCurrentPlan = (plan: string) => userPlan === plan; // Helper function to check if the user is on the current plan

  // If session is loading, display loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If session is null (user not logged in), redirect to login page
  if (!session) {
    router.push("/auth/signin");
    return null;
  }

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
          <Tooltip id="free-plan" text="This plan includes basic features for starters.">
            <p className="text-gray-600 mb-4">Up to 50 requests per month.</p>
          </Tooltip>
          <p className="text-gray-600 mb-4">Basic AI content generation.</p>
          <p className="text-gray-600 mb-6">Community support.</p>
          <PlanBadge plan="free" /> {/* Progressive badge for the plan */}
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
          <Tooltip id="pro-plan" text="Unlock more requests and advanced features.">
            <p className="text-gray-600 mb-4">500 requests per month.</p>
          </Tooltip>
          <p className="text-gray-600 mb-4">Advanced AI content generation.</p>
          <p className="text-gray-600 mb-6">Priority email support.</p>
          <PlanBadge plan="pro" />
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
          <Tooltip id="enterprise-plan" text="Unlimited requests and premium features.">
            <p className="text-gray-600 mb-4">Unlimited requests.</p>
          </Tooltip>
          <p className="text-gray-600 mb-4">Access to all AI features.</p>
          <p className="text-gray-600 mb-6">24/7 premium support.</p>
          <PlanBadge plan="enterprise" />
          <CountdownTimer offerEndDate="2024-12-31" /> {/* Countdown timer */}
          <button
            type="button"
            className={`w-full text-center text-white ${
              isCurrentPlan("enterprise") ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
            } font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105`}
            onClick={() => getPriceFn("enterprise")}
            disabled={isCurrentPlan("enterprise")}
          >
            {isCurrentPlan("enterprise")
              ? "You are on this plan"
              : "Upgrade to Enterprise - ₹1,999/month"}
          </button>
        </div>
      </div>
      
      {/* Plan Benefits Visualization */}
      <div className="mt-10">
        <PlanChart userPlan={userPlan} />
      </div>
    </div>
  );
};

export default UpgradePage;
