// app/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Use an underscore to indicate the variables are intentionally unused
      const popularDomains = ["gmail.com", "yahoo.com", "outlook.com"];
      const emailDomain = profile?.email?.split("@")[1];
      
      if (!emailDomain || !popularDomains.includes(emailDomain)) {
        return false; // Deny sign-in if the email domain is not in the popular list
      }

      return true; // Allow sign-in for popular domains
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});
