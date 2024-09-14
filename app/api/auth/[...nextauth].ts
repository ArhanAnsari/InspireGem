// app/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Dummy user data for demonstration purposes
const users = [
  {
    id: "1",
    name: "Arhan Ansari",
    email: "arhanansari2009@gmail.com",
    password: bcrypt.hashSync("password123", 10), // Hash password for security
  },
];

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Find the user by email
        const user = users.find((user) => user.email === credentials?.email);
        if (user && bcrypt.compareSync(credentials?.password, user.password)) {
          // If user is found and password matches, return the user object
          return user;
        } else {
          // If no user is found or password is incorrect, return null
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user; // Attach user data to the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Attach user data to the JWT token
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin", // Redirect to the sign-in page
    error: "/auth/error",   // Redirect to the error page
  },
  secret: process.env.NEXTAUTH_SECRET,
});
