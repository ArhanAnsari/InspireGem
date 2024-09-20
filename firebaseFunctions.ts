// firebaseFunctions.ts
import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

// Define allowed plans and request limits
const requestLimits = {
  free: 20,
  pro: 200,
  enterprise: Infinity, // Unlimited requests for enterprise plan
};

// Function to get user data from Firestore
export const getUserData = async (email: string) => {
  const userDocRef = doc(db, "users", email);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  return userDoc.data();
};

// Function to check if the user has exceeded their request limit
export const checkUserPlanLimit = async (email: string) => {
  const userData = await getUserData(email);
  const plan = userData?.plan || "free";
  const requestCount = userData?.requestCount || 0;

  if (requestCount >= requestLimits[plan]) {
    return false; // User has reached their limit
  }

  return true; // User can still generate content
};

// Function to increment the user's request count after each AI content generation
export const incrementRequestCount = async (email: string) => {
  const userDocRef = doc(db, "users", email);
  await updateDoc(userDocRef, {
    requestCount: increment(1),
  });
};
