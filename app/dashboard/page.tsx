/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useSession } from "next-auth/react";
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
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Welcome to the Dashboard, {session?.user?.name}</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">AI Content Generator</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate AI content"
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg"
        />
        <button
          onClick={generateAIContent}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Generate AI Content
        </button>
        {output && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Generated Content:</h3>
            <p>{output}</p>
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <PlansPage />
      </div>
      <ToastContainer />
    </div>
  );
}
