//app/api/getUserData/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/firebaseAdmin";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Invalid email parameter" }, { status: 400 });
  }

  try {
    const userDoc = await adminDb.collection("users").doc(email).get();
    if (!userDoc.exists) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(userDoc.data(), { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
