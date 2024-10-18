// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User } from "next-auth";
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

      if (!userEmail) {
        console.error("No email found for user");
        return false; // Block sign-in if no email
      }

      const userDocRef = adminDb.collection("users").doc(userEmail);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        // User already exists, log the user data for verification
        const userData = userDoc.data();
        console.log("User signed in successfully:", {
          email: userEmail,
          plan: userData?.plan,
          requestCount: userData?.requestCount,
          provider: account?.provider,
        });
      } else {
        // New user, create a default entry in Firestore
        const newUser = {
          plan: "free", // Default plan
          requestCount: 0, // Default request count
          email: userEmail,
        };
        await userDocRef.set(newUser);
        console.log("New user created and signed in successfully:", {
          email: userEmail,
          plan: "free",
          requestCount: 0,
          provider: account?.provider,
        });
      }

      return true; // Allow sign-in
    },
    async session({ session, user }) {
      // You can add more data to the session object here if needed
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect to the dashboard after sign-in
      return `${baseUrl}/dashboard`;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
