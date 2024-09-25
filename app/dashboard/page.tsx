"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlansPage from "../plans/page";
import { checkUserPlanLimit, incrementRequestCount, getPreviousContent } from "@/firebaseFunctions"; // Import Firebase functions
import { DocumentData } from "firebase/firestore"; // Import DocumentData type from Firebase
import MarkdownRenderer from "@/components/MarkdownRenderer"; // Import the custom MarkdownRenderer
import { StarIcon } from "@heroicons/react/24/solid"; // Import StarIcon from Heroicons

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [previousContent, setPreviousContent] = useState<DocumentData[]>([]); // Define state as an array of DocumentData
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter();

  // Redirect unauthenticated users to sign in page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch previously generated content when session is ready
  useEffect(() => {
    if (session?.user?.email) {
      const fetchPreviousContent = async () => {
        try {
          const { content } = await getPreviousContent(session.user.email as string); // Extract content from the response
          setPreviousContent(content); // Set the previously generated content
        } catch (error) {
          console.error("Error fetching previous content:", error);
          toast.error("Failed to load previous content.");
        }
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

    // Avoid making Firebase API calls on the server side
    if (typeof window === "undefined") return;

    // Check user's plan limits before making the API call
    const canGenerate = await checkUserPlanLimit(session?.user?.email ?? "");

    if (!canGenerate) {
      toast.error("You have reached your limit for this month.");
      return;
    }

    setIsLoading(true); // Start loading

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

      // Increment the user's request count in Firebase
      await incrementRequestCount(session?.user?.email ?? "");
    } catch (error) {
      toast.error("An error occurred while generating AI content.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // If session is still loading
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
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate AI Content'}
        </button>
        {output ? (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold">Generated Content:</h3>
            {/* Render the output as Markdown using the MarkdownRenderer */}
            <MarkdownRenderer content={output} />
          </div>
        ) : (
          <div className="mt-6 text-gray-500">No content generated yet.</div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <PlansPage />
      </div>

      {/* Display previously generated content */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Previous Content</h2>
        {previousContent.length > 0 ? (
          <ul className="list-disc list-inside space-y-2">
            {previousContent.map((content, index) => (
              <li key={index}>
                <MarkdownRenderer content={content.generatedContent} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No previously generated content found.</p>
        )}
      </div>

      {/* Star us on GitHub Button */}
      <div className="mt-8">
        <a
          href="https://github.com/ArhanAnsari/InspireGem"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-gray-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-gray-900 transition-colors"
        >
          <StarIcon className="w-5 h-5 mr-2 text-yellow-400" />
          Star us on GitHub
        </a>
      </div>

      <ToastContainer />
    </div>
  );
}
