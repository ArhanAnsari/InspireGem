// app/plans/layout.tsx
import React from "react";
import Layout from "@/components/Layout"; // Import Layout
import SEO from "@/components/SEO"; // SEO component
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Metadata for SEO
export const metadata = {
  title: "Plans - InspireGem",
  description: "Explore our plans and choose the one that fits your needs best.",
};

const PlansLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      {/* SEO Component */}
      <SEO title={metadata.title} description={metadata.description} />
      <body className="bg-gray-100 text-gray-900 antialiased">
        <Layout>
          <main className="min-h-screen p-6 flex flex-col items-center">
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

export default PlansLayout;
