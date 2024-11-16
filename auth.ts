// auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { adminDb } from "@/firebaseAdmin";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
  async signIn({ user, account }) {
  const { email } = user;
  const { provider } = account;

  if (!email || !provider) return false;

  const userDocRef = adminDb.collection("users").doc(email);

  try {
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      if (!userData) {
        console.error("No user data found.");
        return false;
      }

      // Link the provider if not already linked
      if (!userData.linkedProviders?.includes(provider)) {
        await userDocRef.update({
          linkedProviders: admin.firestore.FieldValue.arrayUnion(provider),
        });
      }

      return true;
    } else {
      // New user - create user document
      await userDocRef.set({
        email,
        plan: "free",
        requestCount: 0,
        provider,
        linkedProviders: [provider],
      });
      return true;
    }
  } catch (error) {
    console.error("Error during signIn:", error);
    return false;
  }
  },

    async session({ session, user }) {
      console.log("Session data:", session);
      session.user.id = user.id;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log("User signed in:", user);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
