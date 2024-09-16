// app/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlansPage from "../plans/page"; // Import the PlansPage component

export default function Dashboard() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard, {session?.user?.name}</h1>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">AI Content Generator</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate AI content"
          className="border p-2 w-full mb-4 h-40"
        />
        <button
          onClick={generateAIContent}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Generate AI Content
        </button>
        {output && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Generated Content:</h3>
            <p>{output}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Available Plans</h2>
        <PlansPage /> {/* Use the imported PlansPage component */}
      </div>

      <ToastContainer />
    </div>
  );
}
