// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
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
  async signIn({ user, account }) {
    const userEmail = user.email;
    const provider = account.provider;

    // Check if user exists
    const userDocRef = adminDb.collection("users").doc(userEmail);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      // User exists, check if provider is already linked
      const userData = userDoc.data();
      if (userData.linkedProviders && userData.linkedProviders.includes(provider)) {
        return true; // Provider already linked, allow sign-in
      } else {
        // Link provider to existing account
        const linkedProviders = userData.linkedProviders || [];
        linkedProviders.push(provider);
        await userDocRef.update({ linkedProviders });
        return true;
      }
    } else {
      // Create new user document
      await userDocRef.set({
        email: userEmail,
        plan: "free",
        requestCount: 0,
        provider,
        linkedProviders: [provider],
      });
      return true;
    }
  },
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
