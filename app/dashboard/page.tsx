/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard, {session?.user?.name}</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">AI Content Generator</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate AI content"
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={generateAIContent}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate AI Content
        </button>
        {output && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Generated Content:</h3>
            <p>{output}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <PlansPage /> {/* Use the imported PlansPage component */}
      </div>

      <ToastContainer />
    </div>
  );
}
