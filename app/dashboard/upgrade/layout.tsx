// app/dashboard/upgrade/layout.tsx
import React from "react";
import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SEO from "@/components/SEO";

export const metadata = {
  title: "Upgrade - InspireGem",
  description: "Upgrade your InspireGem account to access more AI-powered content generation features.",
};

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 antialiased">
        <SEO title={metadata.title} description={metadata.description} />
        <div className="flex flex-col h-screen">
          <Header />
          <main className="flex-1 py-12">{children}</main>
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
