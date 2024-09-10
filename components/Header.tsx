// components/Header.tsx
"use client"; // Make this a client-side component
import React from 'react';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
  const { data: session } = useSession();

  const handleSignIn = async () => {
    try {
      await signIn('google');
      toast.success('Signing in...');
    } catch (error) {
      toast.error('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.info('Signing out...');
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <header className="w-full bg-white shadow p-4">
      <nav className="flex justify-between items-center max-w-4xl mx-auto">
        <Link href="/">
          <span className="text-2xl font-bold">AI App</span>
        </Link>
        <div>
          <Link href="/">
            <span className="mr-4 text-gray-600">Home</span>
          </Link>
          <Link href="/plans">
            <span className="mr-4 text-gray-600">Plans</span>
          </Link>
          {session ? (
            <>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 font-bold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className="text-blue-600 hover:text-blue-700 font-bold"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
