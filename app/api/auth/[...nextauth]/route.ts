//app/api/auth/[...nextauth]/route.ts
import { authOptions } from "@/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
