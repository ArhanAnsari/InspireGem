/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { db } from "@/firebaseConfig"; // Import Firestore instance
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter(db), // Use Firestore instance directly
  callbacks: {
    async signIn({ user }) {
      const userEmail = user.email;

      if (!userEmail) {
        console.error("No email found for user");
        return false; // Block sign-in if no email
      }

      // Reference to the user's document in Firestore
      const userDocRef = doc(db, "users", userEmail);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // User already exists, fetch plan and request count
        const userData = userDoc.data();
        console.log("User Plan:", userData.plan);
        console.log("Request Count:", userData.requestCount);
      } else {
        // New user, create a default entry in Firestore
        const newUser = {
          plan: "free", // Default plan
          requestCount: 0, // Default request count
        };
        await setDoc(userDocRef, newUser);
        console.log("New user created with Free plan and 0 request count.");
      }

      return true; // Allow sign-in
    },
    async session({ session, token, user }) {
      // Pass session information
      return session;
    },
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for POST and GET requests
export { handler as GET, handler as POST };
