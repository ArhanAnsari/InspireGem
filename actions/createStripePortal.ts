"use server";

import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createStripePortal() {
  auth().protect();

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  // Get the Stripe customer ID from Firestore
  const userDoc = await adminDb.collection("users").doc(userId).get();
  const stripeCustomerId = userDoc.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    throw new Error("Stripe customer not found");
  }

  // Create a Stripe billing portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${getBaseUrl()}/dashboard`, // Redirect back to the dashboard after managing subscription
  });

  return session.url; // Return the URL to be used in the frontend for redirecting users
}
