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
    async signIn({ user, account, profile }) {
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
        if (userData?.provider && userData.provider !== provider) {
          console.error("OAuthAccountNotLinked: User exists but provider is different");
          throw new Error("OAuthAccountNotLinked");
        }
      } else {
        // Create a new user document in Firestore
        const newUser = {
          plan: "free",
          requestCount: 0,
          email: userEmail,
          provider: provider,
        };
        await userDocRef.set(newUser);
      }

      return true;
    },
    async session({ session, user }) {
      session.user.id = user.id; // Include user ID in session if needed
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
  events: {
    async signIn({ user }) {
      console.log("User signed in:", user);
    },
    async signOut({ token }) {
      console.log("User signed out:", token);
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
