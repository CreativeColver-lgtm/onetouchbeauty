import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.log("Stripe webhook: not configured (missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET)");
    return NextResponse.json({ received: true, note: "Stripe not configured" });
  }

  let stripe;
  try {
    const Stripe = (await import("stripe")).default;
    stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" as import("stripe").Stripe.LatestApiVersion });
  } catch {
    console.log("Stripe webhook: stripe package not installed");
    return NextResponse.json({ received: true, note: "Stripe SDK not installed" });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("Webhook signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Handle relevant events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("✅ Checkout completed:", {
        sessionId: session.id,
        customerEmail: session.customer_email,
        amount: session.amount_total,
        metadata: session.metadata,
      });
      // TODO: Update booking status in database to "confirmed"
      // TODO: Send confirmation email to customer
      // TODO: Notify salon of new booking
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object;
      console.log("✅ Payment succeeded:", {
        intentId: intent.id,
        amount: intent.amount,
        currency: intent.currency,
      });
      // TODO: Update payment record in database
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      console.log("❌ Payment failed:", {
        intentId: intent.id,
        error: intent.last_payment_error?.message,
      });
      // TODO: Update booking status to "payment_failed"
      // TODO: Notify customer of failed payment
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
