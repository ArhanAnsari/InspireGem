// app/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { toast } from 'react-toastify';

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
      toast.success('Signed in successfully!');
      return true; // Custom logic if needed
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  events: {
    signIn: () => toast.success('Successfully signed in!'),
    signOut: () => toast.info('Successfully signed out!'),
    error: (message) => toast.error(Error: ${message}),
  }
});
