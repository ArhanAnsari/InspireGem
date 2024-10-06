// app/api/checkout/route.ts
import stripe from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get("plan");
  let priceId: string | undefined;

  if (plan === "pro") {
    priceId = "price_1Q0L3aSCr1Ne8DGFAI9n4GbW";
  } else if (plan === "enterprise") {
    priceId = "price_1Q0L3aSCr1Ne8DGF3yD1iMnd";
  } else {
    return NextResponse.json(
      { error: "Invalid plan selected" },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/dashboard/upgrade`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    return NextResponse.json(
      { error: "Something went wrong with Stripe" },
      { status: 500 }
    );
  }
}
