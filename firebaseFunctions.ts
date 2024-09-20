// firebaseFunctions.ts
// Functions for managing user data and request limits in Firestore

import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

// Define allowed plans
type Plan = 'free' | 'pro' | 'enterprise';

// Define request limits based on user plans
const requestLimits: Record<Plan, number> = {
  free: 20,
  pro: 200,
  enterprise: Infinity, // Unlimited for enterprise plan
};

// Get user plan and request count from Firestore
export const getUserPlan = async (email: string) => {
  const userDocRef = doc(db, "users", email);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("User not found");
  }

  const userData = userDoc.data();
  return userData;
};

// Increment request count for a user and check if the limit is exceeded
export const incrementRequestCount = async (email: string) => {
  const userDocRef = doc(db, "users", email);
  const userDoc = await getDoc(userDocRef);
  const userData = userDoc.data();

  const plan = userData?.plan as Plan; // Cast plan as a 'Plan' type
  const requestCount = userData?.requestCount;

  // Check if user exceeded the request limit for their plan
  if (requestCount >= requestLimits[plan]) {
    throw new Error("Request limit exceeded");
  }

  // Increment request count by 1
  await updateDoc(userDocRef, {
    requestCount: increment(1),
  });
};

// Update the user's plan when they upgrade (Pro or Enterprise)
export const updateUserPlan = async (email: string, newPlan: Plan) => { // Use 'Plan' type here
  const userDocRef = doc(db, "users", email);
  await updateDoc(userDocRef, {
    plan: newPlan,
    requestCount: 0, // Reset request count when user upgrades
  });
};
