"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-xl">Innovify</div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-white">Home</Link>
          </li>
          {session ? (
            <>
              <li>
                <Link href="/dashboard" className="text-white">Dashboard</Link>
              </li>
              <li>
                <button onClick={() => signOut()} className="text-white">Sign Out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/auth/signin" className="text-white">Sign In</Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-white">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
