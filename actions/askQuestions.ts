"use server";

import { adminDb } from "@/firebaseAdmin";

// Define limits for users based on their plan type
const PRO_LIMIT = 500;
const FREE_LIMIT = 50;

// Function to handle storing questions and answers
export async function askQuestion({
  userId,
  question,
}: {
  userId: string;
  question: string;
}) {
  const generatedContentRef = adminDb
    .collection("users")
    .doc(userId)
    .collection("generatedContent");

  // Fetch all previously asked questions by the user
  const snapshot = await generatedContentRef.get();
  const userMessages = snapshot.docs.map((doc) => doc.data());

  // Check user limits based on their plan type
  const userRef = await adminDb.collection("users").doc(userId).get();
  const userData = userRef.data();

  if (!userData?.hasActiveMembership && userMessages.length >= FREE_LIMIT) {
    return {
      success: false,
      message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions! 😢`,
    };
  }

  if (userData?.hasActiveMembership && userMessages.length >= PRO_LIMIT) {
    return {
      success: false,
      message: `You've reached the PRO limit of ${PRO_LIMIT} questions! 😢`,
    };
  }

  // Call the API to generate the response from Google Gemini
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: question,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.generatedContent) {
    return {
      success: false,
      message: "Error generating AI content.",
    };
  }

  // Save the question and response to generatedContent
  await generatedContentRef.add({
    question,
    response: data.generatedContent,
    createdAt: new Date(),
  });

  return { success: true, message: data.generatedContent };
}

// Function to fetch previously generated content
export async function fetchGeneratedContent(userId: string) {
  try {
    const generatedContentRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("generatedContent");

    const snapshot = await generatedContentRef.orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      console.log("No previously generated content found.");
      return [];
    }

    // Ensure serializable data by mapping Firestore documents to plain JavaScript objects
    const generatedContent = snapshot.docs.map((doc) => ({
      id: doc.id, // Firestore document ID
      question: doc.data().question || "", // The question asked
      response: doc.data().response || "", // The AI-generated response
      createdAt: doc.data().createdAt.toMillis(), // Convert Firestore Timestamp to milliseconds
    }));

    return generatedContent;
  } catch (error) {
    console.error("Error fetching previously generated content:", error);
    throw new Error("Unable to fetch previously generated content.");
  }
}
