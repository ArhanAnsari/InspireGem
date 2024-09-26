// app/api/getPreviousContent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebaseAdmin"; // Ensure this is server-side only

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const chatRef = adminDb
      .collection("users")
      .doc(email)
      .collection("content");

    const chatSnapshot = await chatRef.get();
    const content = chatSnapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching previous content:", error);
    return NextResponse.json(
      { message: "Failed to load previous content." },
      { status: 500 }
    );
  }
}
