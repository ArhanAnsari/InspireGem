/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { db } from "@/firebaseConfig"; // Import Firestore config
import { doc, setDoc } from "firebase/firestore"; // Import Firestore methods

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Store user data in Firestore when signing in
        const userRef = doc(db, "users", user.email!);
        await setDoc(userRef, {
          email: user.email,
          name: user.name,
          image: user.image,
          plan: "free", // Assign default plan (free)
          requestCount: 0, // Initialize request count
        }, { merge: true }); // Use merge to avoid overwriting existing data
      }
      return true;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like user id from a provider.
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
  // Additional NextAuth configuration options
};

export default NextAuth(authOptions);
