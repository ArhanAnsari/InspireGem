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

    if (!userEmail || !provider) return false;

    try {
      const userDocRef = adminDb.collection("users").doc(userEmail);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();

        if (!userData) {
          console.error("User data not found");
          return false;
        }

        console.log("Existing user signing in:", userData);

        // Check if provider is already linked
        if (userData.linkedProviders && userData.linkedProviders.includes(provider)) {
          return true;
        }

        // Link provider to existing account
        if (userData.provider && userData.provider !== provider) {
          const linkedProviders = userData.linkedProviders || [];
          if (!linkedProviders.includes(provider)) {
            linkedProviders.push(provider);
            await userDocRef.update({ linkedProviders });
          }
          return true;
        }

        // Handle new provider for existing user without provider
        if (!userData.provider) {
          await userDocRef.update({ provider, linkedProviders: [provider] });
          return true;
        }

        // If none of the above conditions are met, return error
        console.error("OAuthAccountNotLinked error");
        return false;
      } else {
        // Create new user document
        console.log("New user signing up:", { email: userEmail, provider });
        await userDocRef.set({
          email: userEmail,
          plan: "free",
          requestCount: 0,
          provider,
          linkedProviders: [provider],
        });
        return true;
      }
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        console.error('Invalid email:', error);
      } else {
        console.error('Sign-in error:', error);
      }
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
