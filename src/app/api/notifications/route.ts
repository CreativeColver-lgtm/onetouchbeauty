// =============================================================================
// POST /api/notifications — Send notification emails
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import {
  sendBookingConfirmation,
  sendCancellationNotification,
  requestReview,
} from '@/lib/notifications'

type NotificationType = 'booking_confirmation' | 'cancellation' | 'review_request'

export async function POST(request: NextRequest) {
  try {
    const { type, bookingId } = (await request.json()) as {
      type: NotificationType
      bookingId: string
    }

    if (!type || !bookingId) {
      return NextResponse.json(
        { error: 'type and bookingId are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch booking with relations
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        businesses:business_id(name, address, phone),
        services:service_id(name, duration_minutes, price_pence),
        profiles:client_id(full_name, email)
      `)
      .eq('id', bookingId)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    let success = false

    switch (type) {
      case 'booking_confirmation':
        success = await sendBookingConfirmation(booking)
        break
      case 'cancellation':
        success = await sendCancellationNotification(booking)
        break
      case 'review_request':
        success = await requestReview(booking)
        break
      default:
        return NextResponse.json({ error: `Unknown notification type: ${type}` }, { status: 400 })
    }

    return NextResponse.json({ success })
  } catch (err) {
    console.error('[notifications] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
