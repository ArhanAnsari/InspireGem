// components/Layout.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <div className="max-w-7xl mx-auto px-4">{children}</div>
    </SessionProvider>
  );
};

export default Layout;
