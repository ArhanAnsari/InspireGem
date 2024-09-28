// app/not-found.tsx
import type { Metadata } from "next";
import SEO from "@/components/SEO"; // Import the SEO component 

export const metadata: Metadata = {
  title: "404 - Page Not Found - InspireGem",
  description: "The page you are looking for does not exist. Return to InspireGem's homepage.",
};

export default function NotFound() {
  return (
    <>
      <SEO 
        title="404 - Page Not Found - InspireGem"
        description="The page you are looking for does not exist. Return to InspireGem's homepage."
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      </div>
    </>
  );
}
