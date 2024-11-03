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
      return false; // Block sign-in if no email
    }

    const userDocRef = adminDb.collection("users").doc(userEmail);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      // Check if the provider matches the existing record in Firestore
      if (userData?.provider && userData.provider !== provider) {
        console.error("OAuthAccountNotLinked: User exists but provider is different");
        throw new Error("OAuthAccountNotLinked");
      }

      console.log("User signed in successfully:", {
        email: userEmail,
        plan: userData?.plan,
        requestCount: userData?.requestCount,
        provider: provider,
      });
    } else {
      // New user creation with default data
      const newUser = {
        plan: "free", // Default plan
        requestCount: 0, // Default request count
        email: userEmail,
        provider: provider,
      };
      await userDocRef.set(newUser);
      console.log("New user created and signed in successfully:", {
        email: userEmail,
        plan: "free",
        requestCount: 0,
        provider: provider,
      });
    }

    return true; // Allow sign-in
  },
  async session({ session, user }) {
    console.log("Session created:", session);
    return session;
  },
  async redirect({ baseUrl }) {
    console.log("Redirecting to:", `${baseUrl}/dashboard`);
    return `${baseUrl}/dashboard`;
  },
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
