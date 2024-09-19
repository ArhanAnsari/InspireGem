/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlansPage from "../plans/page";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
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
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
          Welcome, {session?.user?.name}!
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            AI Content Generator
          </h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to generate AI content"
            className="border-2 border-gray-300 w-full h-24 rounded-lg p-4 focus:border-blue-500 outline-none mb-4"
          />
          <button
            onClick={generateAIContent}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Generate AI Content
          </button>

          {output && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Generated Content:
              </h3>
              <p className="text-gray-600">{output}</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Available Plans
          </h2>
          <PlansPage />
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}
