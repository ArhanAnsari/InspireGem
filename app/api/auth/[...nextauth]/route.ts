/* eslint-disable @typescript-eslint/no-unused-vars */
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
  const provider = account?.provider;

  if (!userEmail) {
    console.error("No email found for user");
    return false;
  }

  const userDocRef = adminDb.collection("users").doc(userEmail);
  const userDoc = await userDocRef.get();

  if (userDoc.exists) {
    const userData = userDoc.data();

    // Check for provider mismatch ONLY if the user exists
    if (userData?.provider && userData.provider !== provider) {
      console.error("OAuthAccountNotLinked: User exists but provider is different");
      // Redirect to sign-in with the correct provider information
      return `/api/auth/signin?error=OAuthAccountNotLinked&provider=${userData.provider}`; // Key change here
    }

    console.log("User signed in successfully:", { /* ... */ });

  } else {
    // User doesn't exist, create them
    await userDocRef.set({
      plan: "free",
      requestCount: 0,
      email: userEmail,
      provider: provider,
    });
    console.log("New user created and signed in successfully:", { /* ... */ });
  }
      
      return true;
    },
    async session({ session }) {
      console.log("Session created:", session);
      return session;
    },
    async redirect({ baseUrl }) {
      console.log("Redirecting to:", `${baseUrl}/dashboard`);
      return `${baseUrl}/dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
