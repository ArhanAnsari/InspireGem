// app/layout.tsx
import "./styles/globals.css";
import React from "react";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SEO from "@/components/SEO";

export const metadata = {
  title: "InspireGem - AI-Powered Content Generation Platform",
  description: "InspireGem is an AI-powered platform to create high-quality content using Google Gemini. Sign in to explore our features and get started.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        {/* SEO metadata */}
        <SEO title={metadata.title} description={metadata.description} />
        <div className="flex-1 flex flex-col h-screen">
          {/* Header */}
          <Header />
          <main className="flex-1 overflow-y-auto py-12">{children}</main>
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
        </div>
      </body>
    </html>
  );
}
