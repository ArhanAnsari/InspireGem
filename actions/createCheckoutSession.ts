"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: UserDetails) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  // Check if the user already has a Stripe customer ID in Firestore
  const userDoc = await adminDb.collection("users").doc(userId).get();
  let stripeCustomerId = userDoc.data()?.stripeCustomerId;

  // If no Stripe customer ID, create a new Stripe customer
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });

    // Save the customer ID in Firestore for future reference
    await adminDb.collection("users").doc(userId).update({
      stripeCustomerId: customer.id,
    });

    stripeCustomerId = customer.id;
  }

  // Create a new checkout session for subscription
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1PprpjSCr1Ne8DGFURTf2bSL", // Adjust the price ID based on InspireGem's pricing
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`, // Redirect user back to dashboard after successful upgrade
    cancel_url: `${getBaseUrl()}/dashboard/upgrade`, // Cancel URL for failed payments
  });

  return session.id; // Return the session ID to be used in the frontend
}
