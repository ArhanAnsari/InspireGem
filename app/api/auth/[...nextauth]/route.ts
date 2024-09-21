/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { db } from "@/firebaseConfig";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter({
    db,
  }),
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Sign-in successful");
      return true;
    },
    async session({ session, token, user }) {
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// Export the handlers for POST and GET requests
export { handler as POST, handler as GET };
