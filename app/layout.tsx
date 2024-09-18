import './styles/globals.css';
import Header from '../components/Header';
import { ToastContainer } from 'react-toastify';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-12">{children}</main>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </body>
    </html>
  );
};

export default RootLayout;
