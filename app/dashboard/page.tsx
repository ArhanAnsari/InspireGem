"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlansPage from "../plans/page";
import { askQuestion, fetchGeneratedContent } from "@/actions/askQuestions"; // Updated import
import { checkUserPlanLimit, getUserData } from "@/firebaseFunctions"; // Firebase functions
import { DocumentData } from "firebase/firestore";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { StarIcon } from "@heroicons/react/24/solid";
import SEO from "@/components/SEO";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [previousContent, setPreviousContent] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<string>(""); // State to store the user plan
  const router = useRouter();

  // Redirect unauthenticated users to sign-in page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // Fetch user's plan and request count on component mount
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (session?.user?.email) {
        try {
          const userData = await getUserData(session.user.email);
          if (userData) {
            setUserPlan(userData.plan); // Set the user's plan
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to load user data.");
        }
      }
    };

    fetchUserPlan();
  }, [session]);

  // Function to fetch previously generated content
  const fetchPreviousContent = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const content = await fetchGeneratedContent(session.user.email);
        setPreviousContent(content);
      } catch (error) {
        console.error("Error fetching previous content:", error);
        toast.error("Failed to load previous content.");
      }
    }
  }, [session]);

  // Fetch previously generated content when session is ready
  useEffect(() => {
    fetchPreviousContent();
  }, [session, fetchPreviousContent]);

  // Function to generate AI content
  const generateAIContent = async () => {
    if (!input) {
      toast.error("Please enter some text to generate AI content.");
      return;
    }

    if (!session || !session.user?.email) {
      toast.error("User session is not available.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      // If user is not on the Enterprise plan, check plan limits
      if (userPlan !== "Enterprise") {
        const canGenerate = await checkUserPlanLimit(session.user.email);

        if (!canGenerate) {
          toast.error("You have reached your limit for this month.");
          setIsLoading(false);
          return;
        }
      }

      // Generate AI content using Google Gemini
      const result = await askQuestion({ userId: session.user.email, question: input });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setOutput(result.message); // Set the generated content
      toast.success("AI content generated successfully!");

      // Refresh previously generated content
      await fetchPreviousContent();
      setInput(""); // Clear input after generation
    } catch (error) {
      console.error("Error generating AI content:", error);
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
      <SEO title="Dashboard - InspireGem" description="Access your AI content generation dashboard, view plans, and review your previously generated content on InspireGem." />
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
            {previousContent.map((content) => (
              <li key={content.id}>
                <MarkdownRenderer content={content.response} />
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
