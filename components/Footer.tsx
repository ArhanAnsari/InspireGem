import React from "react";
import Link from "next/link"; // Importing Link from Next.js

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section: Links */}
        <div className="mb-4 md:mb-0">
          <nav className="flex flex-col md:flex-row gap-4">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/auth/signin" className="hover:underline">
              Sign In
            </Link>
            <Link href="/auth/signup" className="hover:underline">
              Sign Up
            </Link>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/dashboard/upgrade" className="hover:underline">
              Upgrade
            </Link>
            <Link href="https://arhanansari.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Portfolio
            </Link>
          </nav>
        </div>

        {/* Right Section: Credits */}
        <div className="text-center">
          <p>Developed by <Link href="https://arhanansari.vercel.app" target="_blank" className="text-blue-500 hover:underline">Arhan Ansari</Link></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
