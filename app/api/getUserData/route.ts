import { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { email } = req.query;

    if (typeof email !== "string") return res.status(400).json({ message: "Invalid email parameter" });

    try {
      const userDoc = await adminDb.collection("users").doc(email).get();
      if (!userDoc.exists) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(userDoc.data());
    } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
