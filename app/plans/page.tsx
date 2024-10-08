"use client";
import React, { useEffect, useState } from "react";
import getStripe from "@/lib/stripe-js";
import SEO from "@/components/SEO"; // Import the SEO component
import { getUserData } from "@/firebaseFunctions"; // Import function to fetch user data
import { useSession } from "next-auth/react"; // Session management
import { useRouter } from "next/navigation"; // Router for redirection
import { Chart } from "react-chartjs-2"; // Chart.js for plan benefits
import { Tooltip } from "react-tooltip"; // Tooltips

export default function PlansPage() {
  const [userPlan, setUserPlan] = useState<string>("free"); // State to hold user's current plan
  const { data: session, status } = useSession(); // Get session from NextAuth
  const router = useRouter(); // Router instance for redirecting
  const [usageData, setUsageData] = useState<number>(0); // User's current usage

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (session?.user?.email) {
        try {
          const userData = await getUserData(session.user.email);
          if (userData) {
            setUserPlan(userData.plan); // Update state with the user's plan
            setUsageData(userData.usage); // Fetch usage data
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
    if (plan === userPlan) {
      return; // If the selected plan is already the user's plan, do nothing
    }

    fetch("/api/checkout?plan=" + plan)
      .then((data) => data.json())
      .then(async (body) => {
        const sessionId = body.sessionId;
        const stripe = await getStripe();
        await stripe?.redirectToCheckout({ sessionId });
      });
  };

  const isCurrentPlan = (plan: string) => userPlan === plan; // Helper function to check if the user is on the current plan

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
        title="Plans - InspireGem"
        description="Explore the available plans on InspireGem and choose the one that fits your content generation needs."
      />
      <h1 className="text-4xl font-bold text-center mb-10">
        Welcome {session?.user?.name}!
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-transform transform-gpu hover:scale-105">
          <h2 className="text-3xl font-bold text-blue-600 mb-4">
            Free Plan <span className="text-xs bg-blue-100 text-blue-600 p-1 rounded">Basic</span>
          </h2>
          <p className="text-gray-600 mb-4">Up to 50 requests per month.</p>
          <Tooltip content="Access basic AI tools" />
          <p className="text-gray-600 mb-4">Basic AI content generation.</p>
          <p className="text-gray-600 mb-6">Community support.</p>
          <button
            type="button"
            className={`w-full text-center text-white ${
              isCurrentPlan("free") ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } font-bold py-3 rounded-lg transition duration-300`}
            onClick={() => getPriceFn("free")}
            disabled={isCurrentPlan("free")}
          >
            {isCurrentPlan("free") ? "You are on this plan" : "Get Started"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-transform transform-gpu hover:scale-105">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Pro Plan <span className="text-xs bg-green-100 text-green-600 p-1 rounded">Popular</span>
          </h2>
          <p className="text-gray-600 mb-4">500 requests per month.</p>
          <Tooltip content="Advanced tools for more powerful AI." />
          <p className="text-gray-600 mb-4">Advanced AI content generation.</p>
          <p className="text-gray-600 mb-6">Priority email support.</p>
          <button
            type="button"
            className={`w-full text-center text-white ${
              isCurrentPlan("pro") ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } font-bold py-3 rounded-lg transition duration-300`}
            onClick={() => getPriceFn("pro")}
            disabled={isCurrentPlan("pro")}
          >
            {isCurrentPlan("pro") ? "You are on this plan" : "Subscribe for ₹499/month"}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-transform transform-gpu hover:scale-105">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Enterprise Plan <span className="text-xs bg-red-100 text-red-600 p-1 rounded">Best Value</span>
          </h2>
          <p className="text-gray-600 mb-4">Unlimited requests.</p>
          <Tooltip content="Premium access to all AI tools." />
          <p className="text-gray-600 mb-4">Access to all AI features.</p>
          <p className="text-gray-600 mb-6">24/7 premium support.</p>
          <button
            type="button"
            className={`w-full text-center text-white ${
              isCurrentPlan("enterprise") ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
            } font-bold py-3 rounded-lg transition duration-300`}
            onClick={() => getPriceFn("enterprise")}
            disabled={isCurrentPlan("enterprise")}
          >
            {isCurrentPlan("enterprise")
              ? "You are on this plan"
              : "Subscribe for ₹1,999/month"}
          </button>
        </div>
      </div>

      {/* Add testimonial section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-center mb-4">What our users are saying:</h3>
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow-md rounded-lg">
            <p>"The Pro Plan gave my content a boost, worth every penny!"</p>
            <span className="block mt-2 text-gray-600">- John Doe</span>
          </div>
          {/* Add more testimonials */}
        </div>
      </div>

      {/* Plan benefits chart */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-center mb-6">Compare Plan Benefits</h3>
        <Chart
          type="bar"
          data={{
            labels: ["Free", "Pro", "Enterprise"],
            datasets: [
              {
                label: "Requests",
                data: [50, 500, Infinity],
                backgroundColor: ["#3b82f6", "#10b981", "#ef4444"],
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
