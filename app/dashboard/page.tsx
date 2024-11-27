//app/dashboard/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlansPage from "../plans/page";
import { askQuestion, fetchGeneratedContent } from "@/actions/askQuestions";
import { checkUserPlanLimit, getUserData, incrementRequestCount } from "@/firebaseFunctions";
import { DocumentData } from "firebase/firestore";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { StarIcon } from "@heroicons/react/24/solid";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";  // Plan badge icons
import SEO from "@/components/SEO";
import Footer from "@/components/Footer"; // Import the Footer component 
import MathRenderer from "@/components/MathRenderer";
import "katex/dist/katex.min.css";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [previousContent, setPreviousContent] = useState<DocumentData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userPlan, setUserPlan] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchUserPlan = async () => {
            if (session?.user?.email) {
                try {
                    const userData = await getUserData(session.user.email);
                    if (userData) {
                        setUserPlan(userData.plan);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    toast.error("Failed to load user data.");
                }
            }
        };

        fetchUserPlan();
    }, [session]);

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

    useEffect(() => {
        fetchPreviousContent();
    }, [session, fetchPreviousContent]);

    const generateAIContent = async () => {
        if (!input) {
            toast.error("Please enter some text to generate AI content.");
            return;
        }

        if (!session || !session.user?.email) {
            toast.error("User session is not available.");
            return;
        }

        // Check for math input (e.g., detect LaTeX syntax like $$...$$)
        const isMathInput = input.trim().startsWith("$$") && input.trim().endsWith("$$");

        if (isMathInput) {
            // Use a state variable to trigger re-render after setting the output
            // This forces React to update the component and render the MathRenderer
            setOutput(""); 
            setTimeout(() => {
                setOutput(input);
                toast.success("Math content displayed successfully!");
            }, 0); // Setting a timeout of 0 ensures the state update happens after the current execution context.

            return;
        }

        setIsLoading(true);

        try {
            if (userPlan !== "enterprise") {
                const canGenerate = await checkUserPlanLimit(session.user.email);

                if (!canGenerate) {
                    toast.error("You have reached your limit for this month.");
                    setIsLoading(false);
                    return;
                }
            }

            const result = await askQuestion({
                userId: session.user.email,
                question: input,
            });

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            setOutput(result.message);
            toast.success("AI content generated successfully!");

            // Increment request count after successful content generation
            await incrementRequestCount(session.user.email);
            
            await fetchPreviousContent();
            setInput("");
        } catch (error) {
            console.error("Error generating AI content:", error);
            toast.error("An error occurred while generating AI content.");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-full mx-auto p-4 md:p-6 overflow-hidden">
            <SEO 
                title="Dashboard - InspireGem" 
                description="Access your AI content generation dashboard, view plans, and review your previously generated content on InspireGem." 
                />

    <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Welcome to the Dashboard, {session?.user?.name}
    </h1>
    
    <div className="flex items-center mb-6">
        <CheckBadgeIcon className="w-6 h-6 mr-2 text-blue-500" />
        <span className="text-lg font-semibold text-gray-600">
            Your current plan: {userPlan === "free" ? "Free Plan" : userPlan === "pro" ? "Pro Plan" : "Enterprise Plan"}
        </span>
    </div>        
        </div>

            {/* AI Content Generator Section */}
            <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2">AI Content Generator</h2>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to generate AI content"
                    className="border p-2 w-full mb-4 rounded resize-none"
                    rows={4}
                />
                <button
                    onClick={generateAIContent}
                    className={`bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 transition-transform transform hover:scale-105'}`}  // Button animation
                    disabled={isLoading}
                >
                    {isLoading ? 'Generating...' : 'Generate AI Content'}
                </button>
                {output ? (
            output.trim().startsWith("$$") && output.trim().endsWith("$$") ? (
                <MathRenderer content={output.slice(2, -2).trim()} displayMode={true} />
            ) : (
                <div className="mt-6 bg-gray-100 p-4 rounded overflow-x-auto">
                    <h3 className="text-lg font-semibold">Generated Content:</h3>
                    <MarkdownRenderer content={output} />
                </div>
            )
        ) : (
            <div className="mt-6 text-gray-500">No content generated yet.</div>
        )}
            </div>

            {/* Display Plans */}
            <div>
                <h2 className="text-lg md:text-xl font-semibold mb-4">Available Plans</h2>
                <PlansPage />
            </div>

            {/* Display previously generated content */}
            <div className="mt-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">Previously Generated Content</h2>
                {previousContent.length ? (
                    <div className="flex flex-col space-y-4">
                        {previousContent.map((content) => {
    const isMathContent =
        content.response.trim().startsWith("$$") &&
        content.response.trim().endsWith("$$");

    return (
        <div
            key={content.id}
            className="border p-4 rounded break-words overflow-x-auto"
        >
            <h3 className="font-semibold">{content.question}</h3>
            {isMathContent ? (
                <MathRenderer
                    content={content.response.slice(2, -2).trim()}
                    displayMode={true}
                />
            ) : (
                <MarkdownRenderer content={content.response} />
            )}
            <p className="text-sm text-gray-500">
                Generated on {new Date(content.createdAt).toLocaleString()}
            </p>
        </div>
    );
                    })}
                ) : (
                    <p>No previous content found.</p>
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
            {/* Footer */}
            <Footer />
            <ToastContainer />
        </div>
    );
}
