//firebaseFunctions.ts
import { db } from "./firebaseConfig";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  increment, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  limit, 
  startAfter, 
  orderBy 
} from "firebase/firestore";
import { adminDb } from "@/firebaseAdmin"; // Import the adminDb for admin-related functions
import { DocumentData } from "firebase/firestore";

// Define the allowed plans as a union type
export type Plan = "free" | "pro" | "enterprise";

// Define an interface for the user data
interface UserData {
  plan: Plan;
  requestCount: number;
  usage: number;
  connectedProviders: string[]; // New field to store connected providers
  displayName?: string; // Optional field for user's name
}

const requestLimits: Record<Plan, number> = {
  free: 50,
  pro: 500,
  enterprise: Infinity,
};

// Initialize user data in Firestore if not present
export const initializeUserData = async (email: string): Promise<void> => {
  const userDocRef = doc(db, "users", email);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      plan: "free",
      requestCount: 0,
      connectedProviders: [], // Initialize as empty
      displayName: "", // Default to empty string
    });
  }
};

// Get user data from Firestore
export const getUserData = async (email: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, "users", email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await initializeUserData(email);
      return await getUserData(email);
    }

    const data = userDoc.data() as UserData;
    return {
      ...data,
      usage: data.requestCount,
    };
  } catch (error) {
    console.error(`Error fetching user data for ${email}:`, error);
    return null;
  }
};

// Update user profile data in Firestore
export const updateUserProfile = async (email: string, updatedData: Partial<UserData>): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", email);
    await updateDoc(userDocRef, updatedData);
  } catch (error) {
    console.error(`Error updating profile for ${email}:`, error);
    throw new Error("Unable to update profile.");
  }
};

// Check if the user has exceeded their request limit
export const checkUserPlanLimit = async (email: string): Promise<boolean> => {
  const userData = await getUserData(email);
  if (!userData) {
    console.warn(`No user data found for ${email}.`);
    return false;
  }

  const { plan, requestCount } = userData;
  const limit = requestLimits[plan];

  return requestCount < limit;
};

// Increment the user's request count
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

// Save generated content to Firestore
export const saveGeneratedContent = async (email: string, generatedContent: string): Promise<void> => {
  try {
    const contentRef = collection(db, "generatedContent");
    await addDoc(contentRef, {
      userEmail: email,
      generatedContent: generatedContent,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error saving generated content for ${email}:`, error);
    throw new Error("Unable to save generated content.");
  }
};

// Fetch previous AI-generated content for a user with pagination
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
      orderBy('timestamp', 'desc'),
      limit(limitVal)
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible.timestamp));
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

// Connect an authentication provider for the user
export const connectProvider = async (email: string, provider: string): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User does not exist.");
    }

    const connectedProviders = userDoc.data()?.connectedProviders || [];
    if (!connectedProviders.includes(provider)) {
      connectedProviders.push(provider);
      await updateDoc(userDocRef, { connectedProviders });
    }
  } catch (error) {
    console.error(`Error connecting provider for ${email}:`, error);
    throw new Error("Unable to connect provider.");
  }
};

// Fetch connected authentication providers for the user
export const getConnectedProviders = async (email: string): Promise<string[]> => {
  try {
    const userDocRef = doc(db, "users", email);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("User does not exist.");
    }

    return userDoc.data()?.connectedProviders || [];
  } catch (error) {
    console.error(`Error fetching connected providers for ${email}:`, error);
    throw new Error("Unable to fetch connected providers.");
  }
};
