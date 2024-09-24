"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlansPage from "../plans/page";
import { checkUserPlanLimit, incrementRequestCount, getPreviousContent } from "@/firebaseFunctions"; // Import Firebase functions
import MarkdownRenderer from "@/components/MarkdownRenderer"; // Import the custom MarkdownRenderer

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [previousContent, setPreviousContent] = useState([]); // State for previous content
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Redirect unauthenticated users to sign in page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch previous content on page load
  useEffect(() => {
    if (session) {
      const fetchPreviousContent = async () => {
        const content = await getPreviousContent(session?.user?.email ?? "");
        setPreviousContent(content); // Set the previously generated content
      };

      fetchPreviousContent();
    }
  }, [session]);

  // Function to generate AI content
  const generateAIContent = async () => {
    if (!input) {
      toast.error("Please enter some text to generate AI content.");
      return;
    }

    if (typeof window === "undefined") return;

    const canGenerate = await checkUserPlanLimit(session?.user?.email ?? "");

    if (!canGenerate) {
      toast.error("You have reached your limit for this month.");
      return;
    }

    setIsLoading(true);

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

      await incrementRequestCount(session?.user?.email ?? "");
    } catch (error) {
      toast.error("An error occurred while generating AI content.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Dashboard, {session?.user?.name}</h1>

      {/* AI Content Generator Section */}
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
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate AI Content'}
        </button>
        {output ? (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Generated Content:</h3>
            <MarkdownRenderer content={output} />
          </div>
        ) : (
          <div className="mt-6 text-gray-500">No content generated yet.</div>
        )}
      </div>

      {/* Previous Content Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Previous AI Content</h2>
        {previousContent.length > 0 ? (
          <ul className="space-y-4">
            {previousContent.map((content, index) => (
              <li key={index} className="bg-gray-100 p-4 rounded">
                <MarkdownRenderer content={content.text} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No previous content found.</p>
        )}
      </div>

      {/* Available Plans Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <PlansPage />
      </div>

      <ToastContainer />
    </div>
  );
      }
