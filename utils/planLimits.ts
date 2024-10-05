//utils/planLimits.ts
import { firestore } from "@/firebaseConfig"; // Adjust the path according to your project setup

const planLimits = {
  free: 50,
  pro: 500,
  enterprise: Infinity, // Unlimited requests for enterprise
};

export async function checkUserPlanLimit(email: string | null) {
  if (!email) return false; // No email means no user, so block access

  try {
    // Fetch user's plan from your Firebase Firestore database
    const userPlan = await getUserPlanByEmail(email);

    // Ensure the plan is one of the valid plan types, with fallback to 'free' plan
    const plan = planLimits.hasOwnProperty(userPlan) ? userPlan : "free";

    // Fetch the number of requests the user has already made from Firestore
    const requestsMade = await getUserRequestsMade(email);

    // Check if the user has exceeded their plan's limit
    return requestsMade < planLimits[plan as keyof typeof planLimits];
  } catch (error) {
    console.error("Error checking user plan limit:", error);
    return false; // If something goes wrong, block access by default
  }
}

// Fetch the user's plan based on their email from Firebase Firestore
async function getUserPlanByEmail(email: string) {
  try {
    const userDocRef = firestore.collection("users").doc(email);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData?.plan || "free"; // Default to 'free' if no plan is found
    } else {
      return "free"; // Default to 'free' if user does not exist
    }
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return "free"; // Default to 'free' in case of any errors
  }
}

// Fetch the number of API requests the user has made from Firebase Firestore
async function getUserRequestsMade(email: string) {
  try {
    const requestsDocRef = firestore.collection("requests").doc(email);
    const requestsDoc = await requestsDocRef.get();

    if (requestsDoc.exists) {
      const requestData = requestsDoc.data();
      return requestData?.requestsMade || 0; // Default to 0 if no data is found
    } else {
      return 0; // Default to 0 if user has not made any requests
    }
  } catch (error) {
    console.error("Error fetching user requests:", error);
    return 0; // Default to 0 in case of any errors
  }
}
