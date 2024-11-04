// app/auth/signin/layout.tsx
import React from "react";
import Layout from "@/components/Layout"; // Import Layout
import SEO from "@/components/SEO"; // SEO component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Metadata for SEO
export const metadata = {
  title: "Error - InspireGem",
  description: "An error occurred during the authentication process. Please try signing in again.",
};

const ErrorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <SEO title={metadata.title} description={metadata.description} />
      <body className="bg-gray-100 text-gray-900 antialiased">
        <Layout>
          <main className="min-h-screen flex flex-col items-center justify-center">
            {children}
          </main>
          {/* Toast Notifications */}
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

export default ErrorLayout;
