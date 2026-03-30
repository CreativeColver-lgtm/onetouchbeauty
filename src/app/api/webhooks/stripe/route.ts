// =============================================================================
// POST /api/webhooks/stripe — Stripe webhook handler
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    console.log('Stripe webhook: not configured (missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET)')
    return NextResponse.json({ received: true, note: 'Stripe not configured' })
  }

  let stripe
  try {
    const Stripe = (await import('stripe')).default
    stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as import('stripe').Stripe.LatestApiVersion })
  } catch {
    console.log('Stripe webhook: stripe package not installed')
    return NextResponse.json({ received: true, note: 'Stripe SDK not installed' })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed'
    console.error('Webhook signature error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // Lazy-import Supabase server client
  const { createClient } = await import('@/lib/supabase-server')
  const supabase = await createClient()

  // Handle relevant events
  switch (event.type) {
    // -----------------------------------------------------------------------
    // Checkout completed — confirm booking
    // -----------------------------------------------------------------------
    case 'checkout.session.completed': {
      const session = event.data.object
      console.log('✅ Checkout completed:', {
        sessionId: session.id,
        customerEmail: session.customer_email,
        amount: session.amount_total,
        metadata: session.metadata,
      })

      const bookingId = session.metadata?.booking_id
      if (bookingId) {
        // Update booking status to confirmed
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingId)

        // If this was a deposit payment, update the deposit record
        if (session.metadata?.payment_type === 'deposit') {
          await supabase
            .from('booking_deposits')
            .update({
              status: 'paid',
              stripe_payment_intent_id: session.payment_intent as string,
            })
            .eq('booking_id', bookingId)
        }

        // Send confirmation email
        try {
          const { data: booking } = await supabase
            .from('bookings')
            .select(`
              *,
              businesses:business_id(name, address, phone),
              services:service_id(name, duration_minutes, price_pence),
              profiles:client_id(full_name, email)
            `)
            .eq('id', bookingId)
            .single()

          if (booking) {
            const { sendBookingConfirmation } = await import('@/lib/notifications')
            await sendBookingConfirmation(booking)
          }
        } catch (notifErr) {
          console.error('Failed to send booking confirmation:', notifErr)
        }
      }
      break
    }

    // -----------------------------------------------------------------------
    // Payment intent succeeded — handle deposits and full payments
    // -----------------------------------------------------------------------
    case 'payment_intent.succeeded': {
      const intent = event.data.object
      console.log('✅ Payment succeeded:', {
        intentId: intent.id,
        amount: intent.amount,
        currency: intent.currency,
        metadata: intent.metadata,
      })

      const bookingId = intent.metadata?.booking_id
      const paymentType = intent.metadata?.payment_type

      if (bookingId) {
        // Update booking deposit if this is a deposit payment
        if (paymentType === 'deposit') {
          await supabase
            .from('booking_deposits')
            .update({
              status: 'paid',
              stripe_payment_intent_id: intent.id,
            })
            .eq('booking_id', bookingId)
            .eq('status', 'pending')

          console.log(`✅ Deposit paid for booking ${bookingId}`)
        }

        // For full payments, update booking status
        if (paymentType === 'full') {
          await supabase
            .from('bookings')
            .update({ status: 'confirmed' })
            .eq('id', bookingId)

          console.log(`✅ Full payment confirmed for booking ${bookingId}`)
        }

        // Award loyalty points
        try {
          const { data: booking } = await supabase
            .from('bookings')
            .select('client_id, business_id, total_pence')
            .eq('id', bookingId)
            .single()

          if (booking) {
            const { earnPoints } = await import('@/lib/loyalty')
            await earnPoints(
              booking.client_id,
              booking.business_id,
              intent.amount,
              bookingId,
              'Points earned from payment'
            )
          }
        } catch (loyaltyErr) {
          console.error('Failed to award loyalty points:', loyaltyErr)
        }
      }
      break
    }

    // -----------------------------------------------------------------------
    // Payment failed
    // -----------------------------------------------------------------------
    case 'payment_intent.payment_failed': {
      const intent = event.data.object
      console.log('❌ Payment failed:', {
        intentId: intent.id,
        error: intent.last_payment_error?.message,
      })

      const bookingId = intent.metadata?.booking_id
      if (bookingId) {
        // Update deposit status to failed
        await supabase
          .from('booking_deposits')
          .update({ status: 'failed' })
          .eq('booking_id', bookingId)
          .eq('status', 'pending')
      }
      break
    }

    // -----------------------------------------------------------------------
    // Charge refunded — handle deposit refunds
    // -----------------------------------------------------------------------
    case 'charge.refunded': {
      const charge = event.data.object
      console.log('💰 Charge refunded:', {
        chargeId: charge.id,
        amount: charge.amount_refunded,
      })

      const paymentIntentId = charge.payment_intent as string
      if (paymentIntentId) {
        await supabase
          .from('booking_deposits')
          .update({ status: 'refunded' })
          .eq('stripe_payment_intent_id', paymentIntentId)
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
