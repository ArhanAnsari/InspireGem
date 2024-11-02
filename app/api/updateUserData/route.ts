//app/api/updateUserData/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { email, userData } = await req.json();

    if (!email || !userData) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    await adminDb.collection("users").doc(email).set(userData, { merge: true });
    return NextResponse.json({ message: "User data updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
