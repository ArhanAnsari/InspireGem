// app/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { notify } from '../components/ToastNotification'; // Import the notification utility

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
      const allowedDomains = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        "icloud.com",
      ];

      const userDomain = profile?.email?.split("@")[1];

      if (userDomain && allowedDomains.includes(userDomain.toLowerCase())) {
        notify("Sign-in successful!", "success"); // Show success notification
        return true;
      }

      notify("Sign-in failed: Unauthorized domain", "error"); // Show error notification
      return false;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
});
