"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <div className="bg-gray-100 min-h-screen">
        {children}
      </div>
    </SessionProvider>
  );
};

export default Layout;
