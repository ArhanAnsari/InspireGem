// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { adminDb } from "@/firebaseAdmin"; // Import Firestore Admin instance

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
  adapter: FirestoreAdapter(adminDb), // Use the Firebase Admin Firestore instance
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        console.error("No email found for user");
        return false;
      }

      const userDocRef = adminDb.collection("users").doc(user.email);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log("User Plan:", userData?.plan);
        console.log("Request Count:", userData?.requestCount);
      } else {
        const newUser = {
          plan: "free", // Default plan
          requestCount: 0, // Default request count
        };
        await userDocRef.set(newUser);
        console.log("New user created with Free plan and 0 request count.");
      }

      return true; // Allow sign-in
    },
    async session({ session }) {
      if (session.user.email) {
        const userDoc = await adminDb.collection("users").doc(session.user.email).get();
        const userData = userDoc.data();
        if (userData) {
          session.user.plan = userData.plan;
          session.user.requestCount = userData.requestCount;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard";
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Error page to show for account linking issues
  },
  debug: true, // Enable debug mode for detailed logs
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
