// /actions/askQuestions.ts

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

  // Generate a mock AI response
  const reply = `Mock response to: "${question}"`;

  // Save the question and response to generatedContent
  await generatedContentRef.add({
    question,
    response: reply,
    createdAt: new Date(),
  });

  return { success: true, message: reply };
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
