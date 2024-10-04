"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-xl">InspireGem</div>

        {/* Menu Toggle for Mobile */}
        <div className="block md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white focus:outline-none"
          >
            {/* Hamburger Icon */}
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <ul className={`md:flex md:space-x-4 ${menuOpen ? "block" : "hidden"} md:block`}>
          <li className="mt-4 md:mt-0">
            <Link href="/" className="text-white block px-3 py-2">Home</Link>
          </li>
          <li className="mt-4 md:mt-0">
            <Link href="/about" className="text-white block px-3 py-2">About Us</Link>
          </li>
          {session ? (
            <>
              <li className="mt-4 md:mt-0">
                <Link href="/dashboard" className="text-white block px-3 py-2">Dashboard</Link>
              </li>
              <li className="mt-4 md:mt-0">
                <button
                  onClick={() => signOut()}
                  className="text-white bg-red-500 hover:bg-red-600 block px-3 py-2 rounded"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="mt-4 md:mt-0">
                <Link href="/auth/signin" className="text-white block px-3 py-2">Sign In</Link>
              </li>
              <li className="mt-4 md:mt-0">
                <Link href="/auth/signup" className="text-white block px-3 py-2">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
