// app/dashboard/layout.tsx
import React from "react";
//import Header from "@/components/Header";
import Layout from "@/components/Layout"; // Import your Layout
import SEO from "@/components/SEO";
import { ToastContainer } from "react-toastify"; // Import ToastContainer for notifications
import "react-toastify/dist/ReactToastify.css";

// Define Metadata
export const metadata = {
  title: "Dashboard - InspireGem",
  description: "Manage your AI-powered content generation and explore additional features with InspireGem.",
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      {/* SEO Component */}
      <SEO title={metadata.title} description={metadata.description} />
      <body className="bg-gray-100 text-gray-900 antialiased">
        <Layout>
          {/* Render the Header and Main Content */}
          {/*<Header />*/}
          <main className="min-h-screen flex-1 overflow-y-auto p-8">
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

export default DashboardLayout;
