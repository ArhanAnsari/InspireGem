import { db } from "./firebaseConfig";
import { doc, getDoc, updateDoc, setDoc, increment, collection, query, where, getDocs, addDoc, serverTimestamp, limit, startAfter } from "firebase/firestore";

// Define the allowed plans as a union type
type Plan = "free" | "pro" | "enterprise";

// Define an interface for the user data
interface UserData {
  plan: Plan;
  requestCount: number;
}

// Define allowed plans and request limits
const requestLimits: Record<Plan, number> = {
  free: 50,
  pro: 500,
  enterprise: Infinity, // Unlimited requests for enterprise plan
};

// Function to initialize user data in Firestore if not present
export const initializeUserData = async (email: string): Promise<void> => {
  const userDocRef = doc(db, "users", email);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      plan: "free", // Default to the free plan
      requestCount: 0, // Start with 0 requests
    });
  }
};

// Function to get user data from Firestore
export const getUserData = async (email: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, "users", email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await initializeUserData(email); // Initialize the user data if it doesn't exist
      return await getUserData(email); // Fetch the newly created data
    }

    return userDoc.data() as UserData;
  } catch (error) {
    console.error(`Error fetching user data for ${email}:`, error);
    return null; // Return null if an error occurs
  }
};

// Function to check if the user has exceeded their request limit
export const checkUserPlanLimit = async (email: string): Promise<boolean> => {
  const userData = await getUserData(email);
  if (!userData) {
    console.warn(`No user data found for ${email}.`);
    return false;
  }

  const { plan, requestCount } = userData;
  const limit = requestLimits[plan];

  // Check if user is within the request limit
  if (requestCount >= limit) {
    return false; // User has reached their limit
  }

  return true;
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

// Function to handle content generation and limit checking
export const handleContentGeneration = async (email: string, generatedContent: string): Promise<void> => {
  const canGenerate = await checkUserPlanLimit(email);

  if (!canGenerate) {
    throw new Error("You have reached your content generation limit for this month.");
  }

  // If user is allowed to generate content, increment request count
  await incrementRequestCount(email);
  
  // Save the newly generated content
  await saveGeneratedContent(email, generatedContent);
};

// Function to save the generated content to Firestore
export const saveGeneratedContent = async (email: string, generatedContent: string): Promise<void> => {
  try {
    const contentRef = collection(db, "generatedContent");

    await addDoc(contentRef, {
      userEmail: email,
      generatedContent: generatedContent,
      timestamp: serverTimestamp(), // Record the time of content generation
    });
  } catch (error) {
    console.error(`Error saving generated content for ${email}:`, error);
    throw new Error("Unable to save generated content.");
  }
};

// Function to fetch previous AI-generated content for a user with pagination
export const getPreviousContent = async (
  email: string,
  lastVisible: DocumentData | null = null,
  limitVal: number = 10
): Promise<{ content: DocumentData[]; lastVisible: DocumentData | null }> => {
  try {
    const contentRef = collection(db, "generatedContent");
    let q = query(
      contentRef,
      where("userEmail", "==", email),
      orderBy('timestamp', 'desc'), // Order by timestamp descending
      limit(limitVal)
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible.timestamp)); // Use timestamp for accurate ordering
    }

    const querySnapshot = await getDocs(q);
    const previousContent = querySnapshot.docs.map((doc) => doc.data());

    return {
      content: previousContent,
      lastVisible: querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
    };
  } catch (error) {
    console.error(`Error fetching previous content for ${email}:`, error);
    throw new Error("Unable to fetch previous content.");
  }
};
