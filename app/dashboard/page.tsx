// app/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // Function to handle AI content generation
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
    <div>
      <h1>Welcome to the Dashboard, {session?.user?.name}</h1>

      <div>
        <h2>AI Content Generator</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate AI content"
        />
        <button onClick={generateAIContent}>Generate AI Content</button>
        {output && (
          <div>
            <h3>Generated Content:</h3>
            <p>{output}</p>
          </div>
        )}
      </div>

      <div>
        <h2>Available Plans</h2>
        <Plans />
      </div>

      <ToastContainer />
    </div>
  );
}
