"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlansPage from "../plans/page";
import { adminDb } from "@/firebaseAdmin"; // Import Firebase Admin
import { DocumentData } from "firebase/firestore"; // Import DocumentData type from Firebase
import MarkdownRenderer from "@/components/MarkdownRenderer"; // Import the custom MarkdownRenderer
import { StarIcon } from "@heroicons/react/24/solid"; // Import StarIcon from Heroicons

// Request limits
const PRO_LIMIT = 500;
const FREE_LIMIT = 50;

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [previousContent, setPreviousContent] = useState<DocumentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
          const chatRef = adminDb
            .collection("users")
            .doc(session.user.email)
            .collection("content");

          const chatSnapshot = await chatRef.get();
          const content = chatSnapshot.docs.map((doc) => doc.data());

          setPreviousContent(content);
        } catch (error) {
          console.error("Error fetching previous content:", error);
          toast.error("Failed to load previous content.");
        }
      };

      fetchPreviousContent();
    }
  }, [session]);

  // Check user limits before generating content
  const checkUserLimits = async () => {
    try {
      const userRef = adminDb.collection("users").doc(session?.user?.email);
      const userDoc = await userRef.get();
      const userData = userDoc.data();

      if (!userData) {
        toast.error("User data not found.");
        return false;
      }

      const isEnterpriseUser = userData.plan === "Enterprise"; // Check if the user is on the Enterprise plan
      if (isEnterpriseUser) {
        return true; // Skip limit check for Enterprise users
      }

      const isProUser = userData.hasActiveMembership;
      const userLimit = isProUser ? PRO_LIMIT : FREE_LIMIT;

      // Check current message count
      const chatRef = userRef.collection("content");
      const chatSnapshot = await chatRef.get();
      const userMessages = chatSnapshot.docs.length;

      // Check if user has reached the limit
      if (userMessages >= userLimit) {
        toast.error(
          isProUser
            ? `You've reached the PRO limit of ${PRO_LIMIT} requests per month.`
            : `You've reached the FREE limit of ${FREE_LIMIT} requests per month. Upgrade to PRO for more requests!`
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking user limits:", error);
      toast.error("Failed to verify user limits.");
      return false;
    }
  };

  // Function to generate AI content
  const generateAIContent = async () => {
    if (!input) {
      toast.error("Please enter some text to generate AI content.");
      return;
    }

    if (typeof window === "undefined") return;

    const canGenerate = await checkUserLimits();

    if (!canGenerate) return;

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

        // Save the generated content to Firebase
        const userRef = adminDb.collection("users").doc(session?.user?.email);
        await userRef.collection("content").add({
          role: "ai",
          message: data.generatedContent,
          createdAt: new Date(),
        });
      } else {
        toast.error("Failed to generate AI content.");
      }
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
      <h1 className="text-3xl font-bold mb-6">
        Welcome to the Dashboard, {session?.user?.name}
      </h1>

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
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate AI Content"}
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
            {previousContent.map((content, index) => (
              <li key={index}>
                <MarkdownRenderer content={content.message} />
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
