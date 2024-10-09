//app/plans/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import getStripe from "@/lib/stripe-js";
import SEO from "@/components/SEO"; // SEO component
import { getUserData } from "@/firebaseFunctions"; // Function to fetch user data from Firebase
import { useSession } from "next-auth/react"; // Session management from NextAuth
import { useRouter } from "next/navigation"; // Router for redirection
import Tooltip from "@/components/Tooltip"; // Tooltip component
import PlanBadge from "@/components/PlanBadge"; // Plan Badge component
import CountdownTimer from "@/components/CountdownTimer"; // Countdown Timer for offers
import PlanChart from "@/components/PlanChart"; // Plan benefits visualization chart

export default function PlansPage() {
  const [userPlan, setUserPlan] = useState<string>("free"); // State to track the user's plan
  const { data: session, status } = useSession(); // Get session data from NextAuth
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    // Fetch the user's plan from Firebase
    const fetchUserPlan = async () => {
      if (session?.user?.email) {
        try {
          const userData = await getUserData(session.user.email);
          if (userData) {
            setUserPlan(userData.plan); // Set user's plan in state
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

  const getPriceFn = async (plan: string) => {
    if (plan === "free") {
      router.push("/dashboard");
      return;
    }

    try {
      const response = await fetch(`/api/checkout?plan=${plan}`);
      if (!response.ok) {
        throw new Error(`Failed to initiate checkout for plan: ${plan}`);
      }
      const body = await response.json();
      const sessionId = body.sessionId;

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Stripe initialization failed");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error during checkout process:", error);
      alert(`Error during checkout process: ${error.message}`);
    }
  };

  const isCurrentPlan = (plan: string) => userPlan === plan;

  // If session is being fetched, show a loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If no session, redirect to the sign-in page
  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* SEO Component */}
      <SEO
        title="Plans - InspireGem"
        description="Explore the available plans on InspireGem and choose the one that fits your content generation needs."
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Display the Plan Badge */}
        <div className="col-span-full">
          <PlanBadge email={session.user?.email || ""} />
        </div>

        {/* Free Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105 relative">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Free Plan</h2>
          <Tooltip id="free-plan" text="This plan includes basic features for starters.">
            <p className="text-gray-600 mb-4">Up to 50 requests per month.</p>
          </Tooltip>
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
            {isCurrentPlan("free") ? "You are on this plan" : "Get Started"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105 relative">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Pro Plan</h2>
          <Tooltip id="pro-plan" text="Unlock more requests and advanced features.">
            <p className="text-gray-600 mb-4">500 requests per month.</p>
          </Tooltip>
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
            {isCurrentPlan("pro") ? "You are on this plan" : "Subscribe for ₹499/month"}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105 relative">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Enterprise Plan</h2>
          <Tooltip id="enterprise-plan" text="Unlimited requests and premium features.">
            <p className="text-gray-600 mb-4">Unlimited requests.</p>
          </Tooltip>
          <p className="text-gray-600 mb-4">Access to all AI features.</p>
          <p className="text-gray-600 mb-6">24/7 premium support.</p>
          <CountdownTimer offerEndDate="2024-12-31" />
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
              : "Subscribe for ₹1,999/month"}
          </button>
        </div>
      </div>

      {/* Plan Benefits Chart */}
      <div className="mt-10">
        <PlanChart userPlan={userPlan} />
      </div>
    </div>
  );
}
