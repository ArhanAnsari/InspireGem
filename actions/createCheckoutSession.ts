"use server";

import { UserDetails } from "@/app/dashboard/upgrade/page";
import { adminDb } from "@/firebaseAdmin";
import getBaseUrl from "@/lib/getBaseUrl";
import stripe from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function createCheckoutSession(userDetails: UserDetails, plan: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

  // first check if the user already has a stripeCustomerId
  let stripeCustomerId;

  const user = await adminDb.collection("users").doc(userId).get();
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

  // Set priceId based on the selected plan
  let priceId;
  if (plan === "pro") {
    priceId = "price_1Q0L3aSCr1Ne8DGFAI9n4GbW"; // Pro plan
  } else if (plan === "enterprise") {
    priceId = "price_1Q0L3aSCr1Ne8DGF3yD1iMnd"; // Enterprise plan
  } else {
    return NextResponse.json(
      { error: "Invalid plan selected" },
      { status: 400 }
    );
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId, // Dynamic price ID
        quantity: 1,
      },
    ],
    mode: "subscription",
    customer: stripeCustomerId,
    success_url: `${getBaseUrl()}/dashboard?upgrade=true`,
    cancel_url: `${getBaseUrl()}/dashboard/upgrade`,
  });

  return session.id;
}
