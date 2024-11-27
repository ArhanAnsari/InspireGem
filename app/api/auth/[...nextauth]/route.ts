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
    try {
      const userDocRef = adminDb.collection("users").doc(user.email!);
      const userDoc = await userDocRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();

        if (
          userData.provider &&
          userData.provider !== account.provider &&
          !userData.linkedProviders?.includes(account.provider)
        ) {
          throw new Error("OAuthAccountNotLinked");
        }

        if (!userData.linkedProviders?.includes(account.provider)) {
          await userDocRef.update({
            linkedProviders: [...(userData.linkedProviders || []), account.provider],
          });
        }

        return true;
      } else {
        await userDocRef.set({
          email: user.email!,
          plan: "free",
          requestCount: 0,
          provider: account.provider,
          linkedProviders: [account.provider],
        });
        return true;
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      return false;
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
