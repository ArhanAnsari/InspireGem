//app/dashboard/upgrade/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import getStripe from "@/lib/stripe-js";
import SEO from "@/components/SEO";
import { getUserData } from "@/firebaseFunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import CountdownTimer from "@/components/CountdownTimer";
import PlanChart from "@/components/PlanChart";
import PlanBadge from "@/components/PlanBadge"; // Moving PlanBadge here
import Footer from "@/components/Footer"; // Import the Footer component

const UpgradePage: React.FC = () => {
  const [userPlan, setUserPlan] = useState<string>("free");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (session?.user?.email) {
        try {
          const userData = await getUserData(session.user.email);
          if (userData) {
            setUserPlan(userData.plan);
          } else {
            throw new Error("User data not found");
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
      if (error instanceof Error) {
        console.error("Error during checkout process:", error);
        alert(`Error during checkout process: ${error.message}`);
      } else {
        console.error("Unknown error during checkout process:", error);
        alert("An unknown error occurred during checkout.");
      }
    }
  };

  const isCurrentPlan = (plan: string) => userPlan === plan;

  if (status === "loading") {
    return <div>Loading...</div>;
  }

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

      {/* Plan Badge Displayed Once at the Top */}
      <div className="flex justify-center mb-6">
        <PlanBadge email={session?.user?.email || ""} />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105">
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
              : "Upgrade to Enterprise - ₹1,999/month"}
          </button>
        </div>
      </div>

      {/* Plan Benefits Visualization */}
      <div className="mt-10">
        <PlanChart userPlan={userPlan} />
      </div>      
    </div>
    {/* Footer */}
  <Footer />
  );
};

export default UpgradePage;
