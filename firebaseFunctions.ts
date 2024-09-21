import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

// Define the allowed plans as a union type
type Plan = "free" | "pro" | "enterprise";

// Define an interface for the user data
interface UserData {
  plan: Plan;
  requestCount: number;
}

// Define allowed plans and request limits
const requestLimits: Record<Plan, number> = {
  free: 20,
  pro: 200,
  enterprise: Infinity, // Unlimited requests for enterprise plan
};

// Function to get user data from Firestore
export const getUserData = async (email: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, "users", email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return null; // No user data found
    }

    return userDoc.data() as UserData; // Ensure the returned data matches UserData interface
  } catch (error) {
    console.error(`Error fetching user data for ${email}:`, error);
    return null; // Return null if an error occurs
  }
};

// Function to check if the user has exceeded their request limit
export const checkUserPlanLimit = async (email: string): Promise<boolean> => {
  const userData = await getUserData(email);

  if (!userData) {
    console.warn(`No user data found for ${email}. Defaulting to free plan.`);
    return false; // No user data found, assume no access
  }

  const { plan, requestCount } = userData;
  const limit = requestLimits[plan];

  if (requestCount >= limit) {
    return false; // User has reached their limit
  }

  return true; // User can still generate content
};

// Function to increment the user's request count after each AI content generation
export const incrementRequestCount = async (email: string): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", email);
    await updateDoc(userDocRef, {
      requestCount: increment(1),
    });
  } catch (error) {
    console.error(`Error incrementing request count for ${email}:`, error);
    throw new Error("Unable to increment request count.");
  }
};
