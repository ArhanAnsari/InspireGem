// app/layout.tsx
import './styles/globals.css';
import React from 'react';
import Header from '../components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
        <main className="min-h-screen flex flex-col items-center justify-center py-12">
          {children}
        </main>
        {/* Toast notifications container */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </body>
    </html>
  );
};

export default RootLayout
