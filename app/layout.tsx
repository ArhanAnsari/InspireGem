// app/layout.tsx
import "./styles/globals.css";
import React from "react";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO"; // Import the SEO component

/*title="InspireGem - AI-Powered Content Generation"
        description="InspireGem is an AI-powered content generation platform that uses Google Gemini to help you create high-quality content effortlessly. Sign in to get started."
      />*/

// Define Metadata
export const metadata = {
  title: "InspireGem - AI-Powered Content Generation",
  description: "InspireGem is an AI-powered content generation platform that uses Google Gemini to help you create high-quality content effortlessly. Sign in to get started.",
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      {/* SEO Component */}
      <SEO title={metadata.title} description={metadata.description} />
      <body className="bg-gray-100 text-gray-900 antialiased">
        <Layout>
          <Header />
          <main className="min-h-screen flex flex-col items-center justify-center py-12">
            {children}
          </main>
          {/* Toast notifications container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
