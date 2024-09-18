import "./styles/globals.css";
import React from "react";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`bg-gray-50 ${inter.className}`}>
        <SessionProvider>
          <Header />
          <main className="min-h-screen flex flex-col items-center justify-center py-12 px-6">
            {children}
          </main>
          {/* Toast notifications container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar
          />
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;
