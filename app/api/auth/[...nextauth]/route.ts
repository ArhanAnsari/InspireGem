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
      try {
        const userEmail = user.email;
        const provider = account?.provider;

        if (!userEmail) {
          throw new Error("No email found for user");
        }

        const userDocRef = adminDb.collection("users").doc(userEmail);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const userData = userDoc.data();

          // Link account if provider doesn't match
          if (userData.provider && userData.provider !== provider) {
            await userDocRef.update({ provider });
            console.log("User signed in successfully:", {
              email: userEmail,
              plan: userData?.plan,
              requestCount: userData?.requestCount,
              provider: provider,
            });
          }
        } else {
          const newUser = {
            email: userEmail,
            plan: "free",
            requestCount: 0,
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

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },
    
    async session({ session, user }){
      console.log("Session created:", session);
      session.user.id = user.id;
      return session;
    },
  },

  events: {
    async onSignIn({ user }) {
      console.log("User signed in:", user);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
