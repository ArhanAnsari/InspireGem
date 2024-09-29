"use server";

import { adminDb } from "@/firebaseAdmin";

// Define limits for users based on their plan type
const PRO_LIMIT = 500;
const FREE_LIMIT = 50;

// Function to handle storing questions and generating AI content
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

  // Enforce limits for free and PRO users
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

  // Generate AI content via absolute URL for /api/generate
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: question }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.error || "Error generating AI content.",
      };
    }

    const data = await response.json();
    const reply = data.generatedContent; // AI-generated content from Google Gemini

    // Save the question and AI-generated response to Firestore
    await generatedContentRef.add({
      question,
      response: reply,
      createdAt: new Date(),
    });

    return { success: true, message: reply };
  } catch (error) {
    console.error("Error generating AI content:", error);
    return { success: false, message: "Error generating AI content." };
  }
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

    // Map through documents to extract data
    const generatedContent = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return generatedContent;
  } catch (error) {
    console.error("Error fetching previously generated content:", error);
    throw new Error("Unable to fetch previously generated content.");
  }
}
