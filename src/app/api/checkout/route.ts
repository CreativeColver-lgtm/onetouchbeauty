import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceIds, salonId, date, time, clientEmail, amount, depositOnly } = body;

    if (!serviceIds?.length || !salonId || !date || !time || !clientEmail) {
      return NextResponse.json(
        { error: "Missing required fields: serviceIds, salonId, date, time, clientEmail" },
        { status: 400 }
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        {
          error: "Stripe is not configured",
          message: "Payment processing is not available yet. Please set STRIPE_SECRET_KEY in your environment variables to enable payments.",
          hint: "Add STRIPE_SECRET_KEY to your .env.local file",
        },
        { status: 503 }
      );
    }

    // Dynamic import to handle stripe not being installed
    let stripe;
    try {
      const Stripe = (await import("stripe")).default;
      stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" as import("stripe").Stripe.LatestApiVersion });
    } catch {
      return NextResponse.json(
        {
          error: "Stripe SDK not installed",
          message: "The Stripe package is not installed. Run: npm install stripe",
          hint: "npm install stripe",
        },
        { status: 503 }
      );
    }

    const paymentAmount = depositOnly
      ? Math.max(1000, Math.round((amount || 0) * 0.2))
      : amount || 0;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: clientEmail,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: depositOnly ? "Booking Deposit" : "Booking Payment",
              description: `Salon ${salonId} — ${date} at ${time}`,
            },
            unit_amount: paymentAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/booking?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/booking?cancelled=true`,
      metadata: {
        salonId,
        serviceIds: JSON.stringify(serviceIds),
        date,
        time,
        depositOnly: String(depositOnly || false),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Payment processing failed";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
