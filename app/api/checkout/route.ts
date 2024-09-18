// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get('plan');
  let priceId: string | undefined;

  // Set Stripe Price IDs for each plan
  if (plan === 'pro') {
    priceId = 'price_1Q0L3aSCr1Ne8DGFAI9n4GbW'; // Replace with your actual Stripe price ID
  } else if (plan === 'enterprise') {
    priceId = 'price_1Q0L3aSCr1Ne8DGF3yD1iMnd'; // Replace with your actual Stripe price ID
  } else {
    return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/plans`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong with Stripe' }, { status: 500 });
  }
}
