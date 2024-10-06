"use server";

import { getUserData, checkUserPlanLimit } from "@/firebaseFunctions"; // Import necessary functions from firebaseFunctions.ts
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";

export const createCheckoutSession = async (userEmail: string, plan: string) => {
  try {
    // Fetch user data from Firestore
    const userData = await getUserData(userEmail);

    if (!userData) {
      throw new Error("User data not found.");
    }

    // Check if user has reached the request limit
    const isWithinLimit = await checkUserPlanLimit(userEmail);

    if (!isWithinLimit) {
      throw new Error("You have reached your plan's request limit.");
    }
    // first check if the user already has a stripeCustomerId
  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(user).get();
  stripeCustomerId = user.data()?.stripeCustomerId;

  if (!stripeCustomerId) {
    // create a new stripe customer
    const customer = await stripe.customers.create({
      email: userDetails.email,
      name: userDetails.name,
      metadata: {
        userId,
      },
    });

    await adminDb.collection("users").doc(userId).set({
      stripeCustomerId: customer.id,
    });

    stripeCustomerId = customer.id;
  }
    // Stripe price IDs for plans
    const priceId = plan === "pro"
      ? "price_1Q0L3aSCr1Ne8DGFAI9n4GbW"  // Pro Plan price ID
      : plan === "enterprise"
        ? "price_1Q0L3aSCr1Ne8DGF3yD1iMnd" // Enterprise Plan price ID
        : null;

    if (!priceId) {
      throw new Error("Invalid plan selected.");
    }

    // Create a checkout session in Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${getBaseUrl()}/dashboard/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl()}/dashboard/upgrade/cancel`,
    });

    // Return the session ID for the Stripe checkout session
    return session.id;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session.");
  }
};
