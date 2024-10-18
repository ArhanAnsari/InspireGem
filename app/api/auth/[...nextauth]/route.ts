// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User, Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { adminDb } from "@/firebaseAdmin";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter(adminDb),
  callbacks: {
    async signIn({ account, user }) {
      const userEmail = user.email;

      if (!userEmail) {
        console.error("No email found for user");
        return false; // Block sign-in if no email
      }

      const userDocRef = adminDb.collection("users").doc(userEmail);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        // User already exists, allow sign-in
        return true;
      } else {
        // New user, create a default entry in Firestore
        const newUser = {
          plan: "free", // Default plan
          requestCount: 0, // Default request count
          email: userEmail,
        };
        await userDocRef.set(newUser);
        return true; // Allow sign-in
      }
    },
    async session({ session, user }) {
      return session; // Return the session as is
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after sign-in
      return `${baseUrl}/dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
