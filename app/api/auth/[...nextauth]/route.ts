//app/api/auth/[...nextauth]/route.ts
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

      if (!userEmail) return false;

      try {
        const userDocRef = adminDb.collection("users").doc(userEmail);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          
          if (userData?.provider && userData.provider !== provider) {
            throw new Error("OAuthAccountNotLinked");
          }
          // Update provider if needed
          await userDocRef.update({ provider });
          return true;
        } else {
          // Create a new user if not found
          await userDocRef.set({
            email: userEmail,
            plan: "free",
            requestCount: 0,
            provider,
          });
          return true;
        }
      } catch (error) {
        console.error("Sign-in error:", error);
        if (error.message === "OAuthAccountNotLinked") return false;
        return false;
      }
    },
    
    async session({ session, user }) {
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
