/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import PlansPage from '../plans/page';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const generateAIContent = async () => {
    if (!input) {
      toast.error('Please enter some text to generate AI content.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.generatedContent);
        toast.success('AI content generated successfully!');
      } else {
        toast.error('Failed to generate AI content.');
      }
    } catch (error) {
      toast.error('An error occurred while generating AI content.');
    }
  };

  if (status === 'loading') {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6">Welcome, {session?.user?.name}</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">AI Content Generator</h2>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate AI content"
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={generateAIContent}
          className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg shadow-lg transition-all"
        >
          Generate AI Content
        </button>
        {output && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Generated Content:</h3>
            <p>{output}</p>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-6">Available Plans</h2>
      <PlansPage />

      <ToastContainer />
    </div>
  );
}
