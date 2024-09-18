/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Correct import for app/ directory
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlansPage from "../plans/page"; // Import the PlansPage component

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin"); // Redirect to sign-in if unauthenticated
    }
  }, [status, router]);

  const generateAIContent = async () => {
    if (!input) {
      toast.error("Please enter some text to generate AI content.");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.generatedContent);
        toast.success("AI content generated successfully!");
      } else {
        toast.error("Failed to generate AI content.");
      }
    } catch (error) {
      toast.error("An error occurred while generating AI content.");
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to InspireGem, {session?.user?.name}
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          AI Content Generator
        </h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate AI content"
          className="border p-4 w-full h-32 rounded-lg shadow-inner mb-4"
        />
        <button
          onClick={generateAIContent}
          className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-2 px-6 rounded-lg shadow-lg transition-all"
        >
          Generate AI Content
        </button>

        {output && (
          <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800">Generated Content:</h3>
            <p className="text-gray-700 mt-2">{output}</p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PlansPage /> {/* Use the imported PlansPage component */}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
