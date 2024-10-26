//app/webhook/route.ts
import { adminDb } from "@/firebaseAdmin";
import stripe from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const headersList = await headers(); // Await the promise to get the headers
  const body = await req.text(); // Important: must be req.text() not req.json()
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log("⚠️ Stripe webhook secret is not set.");
    return new NextResponse("Stripe webhook secret is not set", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err}`);
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  // Helper function to get user details
  const getUserDetails = async (customerId: string) => {
    const userDoc = await adminDb
      .collection("users")
      .where("stripeCustomerId", "==", customerId)
      .limit(1)
      .get();

    if (!userDoc.empty) {
      return userDoc.docs[0];
    }
    return null;
  };

  // Handling different event types
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails?.id) {
        console.error("User not found for customerId:", customerId);
        return new NextResponse("User not found", { status: 404 });
      }

      // Get the plan from metadata
      const purchasedPlan = session.metadata?.plan || "pro"; // Default to pro if metadata not found

      // Update the user's membership status based on the purchased plan
      await adminDb.collection("users").doc(userDetails.id).update({
        hasActiveMembership: true,
        plan: purchasedPlan, // Update to the correct plan from metadata
      });

      break;
    }
    case "customer.subscription.deleted":
    case "subscription_schedule.canceled": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const userDetails = await getUserDetails(customerId);
      if (!userDetails?.id) {
        console.error("User not found for customerId:", customerId);
        return new NextResponse("User not found", { status: 404 });
      }

      // Update the user's membership status to false
      await adminDb.collection("users").doc(userDetails.id).update({
        hasActiveMembership: false,
        plan: "free", // Downgrade to free plan if subscription is canceled
      });
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ message: "Webhook received and processed" });
}
